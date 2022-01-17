import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
// import { CacheTypeEnum, REMEMBERME_KEY } from '/@/enums/cacheEnum';
// import projectSetting from '/@/settings/projectSetting';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '/@/enums/cacheEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { HEADER_TOKEN_KEY } from '/@/enums/httpEnum';
import axios from 'axios';
import { checkStatus } from '../http/axios/checkStatus';

// const { permissionCacheType } = projectSetting;

// const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

// 增加 RememberMe 判断
function isRememberMe() {
  const userStore = useUserStoreWithOut();
  // 这里增加 rememberMe
  const rememberMe = userStore.getRememberMe;
  return rememberMe == 1;
  // return isLocal;
}

//请求拦截之前调用
export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getRefreshToken() {
  return getAuthCache(REFRESH_TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isRememberMe() ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value, expire?: number) {
  const fn = isRememberMe() ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true, expire);
}

export function clearAuthCache(immediate = true) {
  const fn = isRememberMe() ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

// 请求队列
let requests: Array<Function> = [];

// Token 是否刷新中
let isRefreshing = false;
export const cancleRequest = false;

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

//前端请求数据的时候执行token鉴权
export function doRefreshToken(config: any) {
  if (config.url.includes('refreshToken')) {
    return config;
  }

  const userStore = useUserStoreWithOut();
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    //执行tokenrefresh ,重新获取token
    // 是否在刷新中
    if (!isRefreshing) {
      isRefreshing = true;

      userStore
        .refreshTokenAction(refreshToken)
        .then(() => {
          //重新设置token
          const token = getToken();
          requests.forEach((cb) => cb(token));
          requests = [];
          isRefreshing = false;
        })
        .catch((result) => {
          isRefreshing = false;
          checkStatus(result.code, `${result.message} : ${result.data}`);
          requests = [];
          source.cancel('refresh token faild.');
          throw new Error(`${result.message} : ${result.data}`);
        });
    } else {
      //后续请求添加取消标识，如过token获取失败，则取消后续请求
      config.cancelToken = source.token;
    }

    return new Promise((resolve) => {
      // 继续请求
      requests.push((token: string) => {
        // 重新设置 token
        config.headers[HEADER_TOKEN_KEY] = token;
        resolve(config);
      });
    });
  }
  return config;
}
