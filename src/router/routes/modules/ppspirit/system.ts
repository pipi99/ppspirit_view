import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/ppspirit/system',
  name: 'PPspirit',
  component: LAYOUT,
  redirect: '/ppspirit/dept',
  meta: {
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title: t('routes.demo.system.moduleName'),
  },
  children: [
    {
      path: 'dict',
      name: 'PPDictManagement',
      meta: {
        title: t('routes.demo.system.dict'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/ppspirit/system/dict/index.vue'),
    },
    {
      path: 'role',
      name: 'PPRoleManagement',
      meta: {
        title: t('routes.demo.system.role'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/ppspirit/system/role/index.vue'),
    },
    {
      path: 'group',
      name: 'PPGroupManagement',
      meta: {
        title: t('routes.demo.system.group'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/ppspirit/system/group/index.vue'),
    },
    {
      path: 'dept',
      name: 'PPDeptManagement',
      meta: {
        title: t('routes.demo.system.dept'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/ppspirit/system/dept/index.vue'),
    },
    {
      path: 'user',
      name: 'PPUserManagement',
      meta: {
        title: t('routes.demo.system.user'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/ppspirit/system/user/index.vue'),
    },
    {
      path: 'menu',
      name: 'PPMenuManagement',
      meta: {
        title: t('routes.demo.system.menu'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/ppspirit/system/menu/index.vue'),
    },
    {
      path: 'permission',
      name: 'PPPermissionManagement',
      meta: {
        title: t('routes.demo.system.permission'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/ppspirit/system/permission/index.vue'),
    },
    {
      path: 'menuall',
      name: 'PPMenuAllManagement',
      meta: {
        title: t('routes.demo.system.menuall'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/ppspirit/system/menuall/index.vue'),
    },
  ],
};

export default system;
