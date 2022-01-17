import BaseApi from '../../base/BaseApi';
/**
 * @description 角色管理APi
 * @author Liv
 * @date 27/12/2021
 * @export
 * @class DeptApi
 * @extends {BaseApi}
 */
export class RoleApi extends BaseApi {
  apiPrefix(): string {
    return '/sys/role';
  }
}
