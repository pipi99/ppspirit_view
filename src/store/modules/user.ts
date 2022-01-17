import type { UserInfo } from '/#/store';
import type { ErrorMessageMode, Result } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import {
  REFRESH_TOKEN_KEY,
  REMEMBERME_KEY,
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams, LoginResultModel } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, refreshTokenApi, rsaPublicKeyApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';
import AESUtil from '/@/utils/auth/AESUtil';
import RSAUtil from '/@/utils/auth/RSAUtil';
import { Persistent } from '/@/utils/cache/persistent';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  expire?: number;
  //refreshToken
  refreshToken?: string;
  refreshExpire?: number;
  rememberMe?: any;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    expire: -1,
    //refreshToken
    refreshToken: undefined,
    refreshExpire: -1,
    // roleList
    roleList: [],
    // Whether the login expired
    //sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP, 这里只为了这个覆盖使用，如果设置了sessionTimeout=true， 登录页面会覆盖当前页面，且路由不会跳转
    // *** sessionTimeout 还是会影响 token过期 ： 见 checkStatus.ts
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    rememberMe: undefined,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRefreshToken(): string {
      return this.refreshToken || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getRememberMe(): number {
      if (this.rememberMe == undefined) {
        this.rememberMe = Persistent.getLocal(REMEMBERME_KEY);
      }

      return this.rememberMe;
    },
  },
  actions: {
    clearToken() {
      this.setToken({ token: '', expire: -1, refreshToken: '', refreshExpire: -1 });
    },
    setToken({ token, expire, refreshToken, refreshExpire }) {
      this.token = token ? token : ''; // for null or undefined value
      this.refreshToken = refreshToken ? refreshToken : ''; // for null or undefined value

      //** 后台返回的是分钟，这里转成毫秒 */
      this.expire = expire ? expire * 60 * 1000 : -1;
      this.refreshExpire = refreshExpire ? refreshExpire * 60 * 1000 : -1;

      //token
      setAuthCache(TOKEN_KEY, token, this.expire);
      setAuthCache(REFRESH_TOKEN_KEY, refreshToken, this.refreshExpire);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList, this.expire);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info, this.expire);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.refreshToken = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        //rememberMe
        Persistent.setLocal(
          REMEMBERME_KEY,
          params.rememberMe == undefined ? 0 : params.rememberMe ? 1 : 0,
          true,
          this.refreshExpire,
        );

        let aesKey: any = AESUtil.generatekey(16);

        //密码加密
        params.password = AESUtil.encrypt(params.password, aesKey);

        const { goHome = true, mode, ...loginParams } = params;

        //获取公钥
        const rsaPublicKey = await rsaPublicKeyApi();

        //公钥加密 aesKey
        aesKey = RSAUtil.encryptedData(rsaPublicKey, aesKey);

        //添加公钥私钥参数
        Object.assign(loginParams, {
          key1: aesKey,
          key2: rsaPublicKey,
        });

        //发起登录请求
        const data = await loginApi(loginParams, mode);

        //登录成功
        //token 用户访问凭证
        //expire token过期时间
        //refreshToken 重新获取凭证的凭证
        //refreshExpire refreshToken 过期时间

        // save token
        this.setToken(data);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: refreshTokenAction
     */
    async refreshTokenAction(
      refreshToken: string | unknown,
      mode?: ErrorMessageMode,
    ): Promise<Result<LoginResultModel> | null> {
      try {
        //发起重新获取token请求
        const result = await refreshTokenApi({ refreshToken }, mode);

        // save token
        if (result.code == 200) {
          this.setToken(result.data);
          return Promise.resolve(result);
        } else {
          return Promise.reject(result);
        }

        // return this.afterLoginAction();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken && !this.getRefreshToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken && !this.getRefreshToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        // 设置用户角色
        const roleList = roles.map((item) => item.roleName) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken || this.getRefreshToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.clearToken();
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
