import { defHttp } from '/@/utils/http/axios';

import { ErrorMessageMode } from '/#/axios';
import { VAxios } from '/@/utils/http/axios/Axios';

enum Api {
  pagelist = '/pagelist',
  pagelistJpa = '/pagelistJpa',
  list = '/list',
  save = '/save',
  update = '/update',
  removeById = '/removeById',
  removeByIds = '/removeByIds',
  getById = '/getById',
}

export default abstract class BaseApi {
  //子类实现获取前缀
  abstract apiPrefix(): string;

  /**
   * @description 追加前缀  apiPrefix
   * @author Liv
   * @date 27/12/2021
   * @protected
   * @param {string} param
   * @returns {*}  {string}
   * @memberof BaseApi
   */
  protected prependApiPrefix(param: string): string {
    const apiPrefix = this.apiPrefix();
    if (apiPrefix.endsWith('/')) {
      return apiPrefix.substring(0, apiPrefix.length - 1) + param;
    }
    return apiPrefix + param;
  }
  /**
   * @description 子类使用，获取请求方法
   * @author Liv
   * @date 27/12/2021
   * @returns {*}  {VAxios}
   * @memberof BaseApi
   */
  protected getHttp(): VAxios {
    return defHttp;
  }

  /**
   * @description 获取分页列表
   * @author Liv
   * @date 27/12/2021
   * @param {*} query
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  GetList(query, mode: ErrorMessageMode = 'modal') {
    return defHttp.post(
      {
        url: this.prependApiPrefix(Api.list),
        data: query,
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 获取分页列表
   * @author Liv
   * @date 27/12/2021
   * @param {*} query
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  GetPageList(query, mode: ErrorMessageMode = 'modal') {
    return defHttp.post(
      {
        url: this.prependApiPrefix(Api.pagelist),
        data: query,
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 获取分页列表
   * @author Liv
   * @date 27/12/2021
   * @param {*} query
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  GetPagelistJpa(query, mode: ErrorMessageMode = 'modal') {
    return defHttp.post(
      {
        url: this.prependApiPrefix(Api.pagelistJpa),
        data: query,
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 新增
   * @author Liv
   * @date 27/12/2021
   * @param {*} obj
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  AddObj(obj, mode: ErrorMessageMode = 'modal') {
    return defHttp.post(
      {
        url: this.prependApiPrefix(Api.save),
        data: obj,
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 更新
   * @author Liv
   * @date 27/12/2021
   * @param {*} obj
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  UpdateObj(obj, mode: ErrorMessageMode = 'modal') {
    return defHttp.put(
      {
        url: this.prependApiPrefix(Api.update),
        data: obj,
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 删除
   * @author Liv
   * @date 27/12/2021
   * @param {*} id
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  DelObj(id, mode: ErrorMessageMode = 'modal') {
    return defHttp.delete(
      {
        url: this.prependApiPrefix(`${Api.removeById}/${id}`),
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 批量删除
   * @author Liv
   * @date 28/12/2021
   * @param {*} ids
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  BatchDelete(ids, mode: ErrorMessageMode = 'modal') {
    return defHttp.delete(
      {
        url: this.prependApiPrefix(Api.removeByIds),
        data: ids,
      },
      {
        errorMessageMode: mode,
      },
    );
  }

  /**
   * @description 根据ID 查询
   * @author Liv
   * @date 27/12/2021
   * @param {*} id
   * @param {ErrorMessageMode} [mode='modal']
   * @returns {*}
   * @memberof BaseApi
   */
  GetObj(id, mode: ErrorMessageMode = 'modal') {
    return defHttp.get(
      {
        url: this.prependApiPrefix(`${Api.getById}/${id}`),
      },
      {
        errorMessageMode: mode,
      },
    );
  }
}
