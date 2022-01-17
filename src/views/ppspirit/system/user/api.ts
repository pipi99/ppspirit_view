import BaseApi from '../../base/BaseApi';
import { ErrorMessageMode } from '/#/axios';
/**
 * @description 角色管理APi
 * @author Liv
 * @date 27/12/2021
 * @export
 * @class DeptApi
 * @extends {BaseApi}
 */
export class UserApi extends BaseApi {
  apiPrefix(): string {
    return '/sys/user';
  }

  /**
   * @description 锁定状态
   * @author Liv
   * @date 27/12/2021
   * @param {*} query
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  doLock(query, mode: ErrorMessageMode = 'modal') {
    return this.getHttp().post(
      {
        url: this.prependApiPrefix('/lock'),
        data: query,
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 锁定状态
   * @author Liv
   * @date 27/12/2021
   * @param {*} query
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  doEnabled(query, mode: ErrorMessageMode = 'modal') {
    return this.getHttp().post(
      {
        url: this.prependApiPrefix('/enabled'),
        data: query,
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 重置密码
   * @author Liv
   * @date 27/12/2021
   * @param {*} query
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  resetPwd(query, mode: ErrorMessageMode = 'modal') {
    return this.getHttp().get(
      {
        url: this.prependApiPrefix('/resetPwd/' + query.userId),
      },
      {
        errorMessageMode: mode,
      },
    );
  }
}
