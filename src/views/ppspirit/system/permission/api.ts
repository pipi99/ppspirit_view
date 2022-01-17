import BaseApi from '../../base/BaseApi';
import { message } from 'ant-design-vue';
/**
 * @description 权限管理APi
 * @author Liv
 * @date 27/12/2021
 * @export
 * @class DeptApi
 * @extends {BaseApi}
 */
export class PermissionApi extends BaseApi {
  apiPrefix(): string {
    return '/sys/permission';
  }

  /**
   * @description 保存权限，用户、角色、用户组
   * @author Liv
   * @date 10/01/2022
   * @param {*} ownerPermissions
   * @memberof PermissionApi
   */
  savePermission(ownerPermissions) {
    this.getHttp()
      .post({
        url: '/sys/permission/saveOwnerPermission',
        data: ownerPermissions,
      })
      .then((_data) => {
        message.success('保存成功！');
      })
      .catch(() => {
        message.error('操作失败！');
      });
  }

  /**
   * @description 删除权限，用户、角色、用户组
   * @author Liv
   * @date 10/01/2022
   * @param {*} ownerPermissions
   * @memberof PermissionApi
   */
  removePermission(ownerId) {
    this.getHttp()
      .delete({
        url: '/sys/permission/removeOwnerPermission/',
        params: ownerId,
      })
      .then((_data) => {
        message.success('保存成功！');
      })
      .catch(() => {
        message.error('操作失败！');
      });
  }

  /**
   * @description 获取所有可分配的权限
   * @author Liv
   * @date 10/01/2022
   * @returns {*}
   * @memberof PermissionApi
   */
  getAllPermissionList() {
    return this.getHttp().post({
      url: '/sys/permission/treeList',
    });
  }
}
