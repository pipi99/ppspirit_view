import BaseApi from '../../base/BaseApi';
import { ErrorMessageMode } from '/#/axios';
/**
 * @description 部门管理APi
 * @author Liv
 * @date 27/12/2021
 * @export
 * @class DeptApi
 * @extends {BaseApi}
 */
export class DeptApi extends BaseApi {
  apiPrefix(): string {
    return '/sys/organ';
  }

  /**
   * @description 树形结构列表
   * @author Liv
   * @date 28/12/2021
   * @param {ErrorMessageMode} [mode='modal']
   * @memberof DeptApi
   */
  pageTreeList(query: any, mode: ErrorMessageMode = 'modal') {
    return this.getHttp().post(
      {
        url: this.prependApiPrefix('/pageTreeList'),
        data: query,
      },
      {
        errorMessageMode: mode,
      },
    );
  }
}
