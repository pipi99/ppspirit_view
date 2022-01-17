import BaseApi from '../../base/BaseApi';
/**
 * @description 菜单库管理APi
 * @author Liv
 * @date 27/12/2021
 * @export
 * @class DeptApi
 * @extends {BaseApi}
 */
export default class DeptApi extends BaseApi {
  apiPrefix(): string {
    return '/sys/menuall';
  }
}
