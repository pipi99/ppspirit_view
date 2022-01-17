import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode, Result } from '/#/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Login = '/signin',
  RefreshToken = '/o/p/auth/refreshToken',
  Captcha = '/o/p/auth/captcha',
  Rsa = '/o/p/auth/getRsaPublicKey',
  Logout = '/signout',
  GetUserInfo = '/sys/auth/signedUser',
  GetPermCode = '/sys/auth/getPermCode',
}

/**
 * @description: 获取公钥
 */
export function rsaPublicKeyApi() {
  return defHttp.get<any>({
    url: Api.Rsa,
  });
}

/**
 * @description: 图片验证码
 */
export function captcha() {
  return defHttp.get<any>({
    url: Api.Captcha,
  });
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: user login api
 */
export function refreshTokenApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<Result<LoginResultModel>>(
    {
      url: Api.RefreshToken,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      params,
    },
    {
      errorMessageMode: mode,
      //需要判断是否重刷成功
      isTransformResponse: false,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
