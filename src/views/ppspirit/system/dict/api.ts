import BaseApi from '../../base/BaseApi';
/**
 * @description 部门管理APi
 * @author Liv
 * @date 27/12/2021
 * @export
 * @class DeptApi
 * @extends {BaseApi}
 */
export default class DictTypeApi extends BaseApi {
  apiPrefix(): string {
    return '/sys/dicttype';
  }
}
