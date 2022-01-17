/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  captchaId: string;
  verifyCode: string;
  rememberMe?: any;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  refreshToken: string;
  expire: number;
  refreshExpire: number;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 真实名字
  alias: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
