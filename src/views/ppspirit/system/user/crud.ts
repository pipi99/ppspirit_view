import { ref } from 'vue';
import { UserApi } from './api';
import { dict, compute } from '@fast-crud/fast-crud';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { defHttp } from '/@/utils/http/axios';
import { message, Modal } from 'ant-design-vue';
// 构建crudOptions的方法
export default function ({ expose }) {
  const api = new UserApi();
  const pageRequest = async (query) => {
    return await api.GetPagelistJpa(query);
  };
  const editRequest = async ({ form, row }) => {
    form.userId = row.userId;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.userId);
  };
  const batchDelRequest = async (ids) => {
    return await api.BatchDelete(ids);
  };

  const addRequest = async ({ form }) => {
    //
    return await api.AddObj(form);
  };
  const selectedRowKeys = ref([]);

  //禁用账号
  const disableUser = (form) => {
    form.enabled = 0;
    api
      .doEnabled(form)
      .then(() => {
        message.success('操作成功');
        expose.doRefresh();
      })
      .catch(() => {
        message.error('操作失败');
        expose.doRefresh();
      });
  };

  //启用账号
  const enableUser = (form) => {
    form.enabled = 1;
    api
      .doEnabled(form)
      .then(() => {
        message.success('操作成功');
        expose.doRefresh();
      })
      .catch(() => {
        message.error('操作失败');
        expose.doRefresh();
      });
  };

  //锁定账号
  const lockUser = (form) => {
    form.locked = 1;
    api
      .doLock(form)
      .then(() => {
        message.success('操作成功');
        expose.doRefresh();
      })
      .catch(() => {
        message.error('操作失败');
        expose.doRefresh();
      });
  };

  //解锁账号
  const unlockUser = (form) => {
    form.locked = 0;
    api
      .doLock(form)
      .then(() => {
        message.success('操作成功');
        expose.doRefresh();
      })
      .catch(() => {
        message.error('操作失败');
        expose.doRefresh();
      });
  };
  //重置密码
  const resetPwd = (form) => {
    Modal.confirm({
      title: `重置密码`,
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, `您确定重置【${form.alias}】的密码？`),
      onOk() {
        api
          .resetPwd(form)
          .then(() => {
            message.success('操作成功');
            expose.doRefresh();
          })
          .catch(() => {
            message.error('操作失败');
            expose.doRefresh();
          });
      },
      onCancel() {},
      class: 'test',
    });
  };
  // const onSelectChange = (changed) => {
  //   console.log('selection', changed);
  //   selectedRowKeys.value = changed;
  // };
  return {
    batchDelRequest, //返回给index.vue去使用
    selectedRowKeys, //返回给index.vue去使用
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      rowHandle: {
        //固定右侧
        fixed: 'right',
        buttons: {
          disable: {
            text: '禁用账号',
            title: '禁用账号',
            type: 'link',
            show: compute(({ row }) => {
              return row.enabled != 0;
            }),
            order: 1, //数字越小，越靠前,默认排序号为1
            click(opts) {
              disableUser(opts.row);
            },
            dropdown: true,
          },
          enable: {
            text: '启用账号',
            title: '启用账号',
            type: 'link',
            show: compute(({ row }) => {
              return row.enabled != 1;
            }),
            order: 2, //数字越小，越靠前,默认排序号为1
            click(opts) {
              enableUser(opts.row);
            },
            dropdown: true,
          },
          lock: {
            text: '锁定账号',
            title: '锁定账号',
            type: 'link',
            show: compute(({ row }) => {
              return row.locked != 1;
            }),
            order: 3, //数字越小，越靠前,默认排序号为1
            click(opts) {
              lockUser(opts.row);
            },
            dropdown: true,
          },
          unlock: {
            text: '解锁账号',
            title: '解锁账号',
            type: 'link',
            show: compute(({ row }) => {
              return row.locked == 1;
            }),
            order: 4, //数字越小，越靠前,默认排序号为1
            click(opts) {
              unlockUser(opts.row);
            },
            dropdown: true,
          },
          resetPwd: {
            text: '重置密码',
            title: '重置密码',
            type: 'link',
            order: 4, //数字越小，越靠前,默认排序号为1
            click(opts) {
              resetPwd(opts.row);
            },
            dropdown: true,
          },
        },
        dropdown: {
          // 操作列折叠
          // 至少几个以上的按钮才会被折叠
          // atLeast: 2, //TODO 注意 [atLeast]参数即将废弃，请给button配置dropdown即可放入折叠
          more: {
            text: '更多',
            icon: null,
            iconRight: 'ion:caret-down-outline',
          },
        },
      },
      table: {
        rowKey: 'userId',
        // rowSelection: {
        //   selectedRowKeys: selectedRowKeys,
        //   onChange: onSelectChange,
        // },
      },
      columns: {
        _index: {
          title: '序号',
          form: { show: false },
          column: {
            // type: "index",
            align: 'center',
            width: '55px',
            columnSetDisabled: true, //禁止在列设置中选择
            formatter: (context) => {
              //计算序号,你可以自定义计算规则，此处为翻页累加
              const index = context.index ?? 1;
              const pagination = expose.crudBinding.value.pagination;
              return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
            },
          },
        },
        // userId: {
        //   title: 'ID',
        //   key: 'id',
        //   type: 'number',
        //   column: {
        //     width: 100,
        //   },
        //   form: {
        //     show: false,
        //   },
        // },
        userName: {
          title: '用户名称',
          form: {
            rules: [
              { required: true, message: '请输入用户名称' },
              { max: 50, message: '请输入用户编号,最大长度50' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        alias: {
          title: '用户姓名',
          form: {
            rules: [
              { required: true, message: '请输入用户姓名' },
              { max: 50, message: '请输入用户姓名,最大长度50' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        orgId: {
          title: '所属机构',
          type: 'dict-tree',
          search: { show: true },
          dict: dict({
            async getData(dict) {
              return defHttp.post({
                url: dict.url,
              });
            },
            value: 'organId',
            label: 'organName',
            url: '/sys/organ/treeList',
            isTree: true,
          }),
          form: {
            component: {
              fieldNames: { label: 'organName', key: 'organId', value: 'organId' },
            },
            rules: [{ required: true, message: '请选择' }],
          },
          column: {
            width: 180,
          },
        },

        gender: {
          title: '性别',
          type: 'dict-select',
          search: { show: true },
          form: {
            rules: [{ required: true, message: '请选择' }],
          },
          dict: dict({
            data: [
              { value: 1, label: '男' },
              { value: 0, label: '女' },
            ],
          }),
          column: {
            width: 180,
          },
        },

        mobile: {
          title: '联系方式',
          form: {
            rules: [
              { required: true, message: '请输入' },
              { max: 50, message: '联系方式最大长度50' },
            ],
          },
          type: 'text',
          column: {
            width: 180,
          },
        },
        degree: {
          title: '学历',
          type: 'dict-select',
          dict: dict({
            url: '/sys/dict/getDictByTypeCode/DEGREE',
            value: 'dictCode',
            label: 'dictName',
          }),
          column: {
            width: 180,
          },
        },

        enabled: {
          title: '是否禁用',
          type: 'dict-select',
          search: { show: true },
          form: {
            component: {
              value: 0,
            },
            show: false,
          },
          viewForm: {
            show: true,
          },
          dict: dict({
            data: [
              { value: 0, label: '是' },
              { value: 1, label: '否' },
            ],
          }),
          column: {
            width: 180,
          },
        },
        // expired: {
        //   title: '账号是否过期',
        //   type: 'dict-select',
        //   search: { show: true },
        //   form: {
        //     rules: [{ required: true, message: '请选择' }],
        //   },
        //   dict: dict({
        //     data: [
        //       { value: 1, label: '是' },
        //       { value: 0, label: '否' },
        //     ],
        //   }),
        //   column: {
        //     width: 180,
        //   },
        // },
        // credentialsExpired: {
        //   title: '密码是否过期',
        //   type: 'dict-select',
        //   search: { show: true },
        //   form: {
        //     rules: [{ required: true, message: '请选择' }],
        //   },
        //   dict: dict({
        //     data: [
        //       { value: 1, label: '是' },
        //       { value: 0, label: '否' },
        //     ],
        //   }),
        //   column: {
        //     width: 180,
        //   },
        // },

        locked: {
          title: '是否锁定',
          type: 'dict-select',
          search: { show: true },
          form: {
            component: {
              value: 0,
            },
            show: false,
          },
          viewForm: {
            show: true,
          },
          dict: dict({
            data: [
              { value: 1, label: '是' },
              { value: 0, label: '否' },
            ],
          }),
          column: {
            width: 180,
          },
        },
        lockTime: {
          title: '锁定时间',
          type: 'datetime',
          form: {
            show: false,
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss', //输入值的格式
              events: {
                onChange(context) {
                  console.log('change', context);
                },
              },
            },
          },
          viewForm: {
            show: true,
          },
        },
        email: {
          title: '邮箱',
          form: {
            rules: [
              { max: 50, message: '邮箱最大长度50' },
              {
                pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                message: '输入正确的邮箱',
              },
            ],
          },
          type: 'text',
          column: {
            width: 180,
          },
        },
        birthday: {
          title: '出生日期',
          type: 'date',
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss', //输入值的格式
              events: {
                onChange(context) {
                  console.log('change', context);
                },
              },
            },
          },
        },
        roleIds: {
          title: '拥有角色',
          sortable: true,
          type: 'dict-select',
          form: {
            title: '拥有角色',
            component: {
              mode: 'multiple',
              fieldNames: { label: 'roleAlias', key: 'roleId', value: 'roleId' },
            },
          },
          dict: dict({
            async getData(dict) {
              return defHttp.post({
                url: dict.url,
              });
            },
            value: 'roleId',
            label: 'roleAlias',
            url: '/sys/role/list',
            isTree: true,
          }),
          column: {
            width: 290,
            component: {
              color: 'auto', // 自动染色
              defaultLabel: '-', //无数据字典时的默认文本
            },
          },
        },
        groupIds: {
          title: '所属用户组',
          sortable: true,
          type: 'dict-select',
          form: {
            title: '所属用户组',
            component: {
              mode: 'multiple',
              fieldNames: { label: 'groupName', key: 'groupId', value: 'groupId' },
            },
          },
          dict: dict({
            async getData(dict) {
              return defHttp.post({
                url: dict.url,
              });
            },
            value: 'groupId',
            label: 'groupName',
            url: '/sys/group/list',
            isTree: true,
          }),
          column: {
            width: 290,
            component: {
              color: 'auto', // 自动染色
              defaultLabel: '-', //无数据字典时的默认文本
            },
          },
        },

        photo: {
          title: '头像',
          type: 'text',
        },
        createDate: {
          title: '创建时间',
          type: 'datetime',

          form: {
            show: false,
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss', //输入值的格式
            },
          },
          viewForm: {
            show: true,
          },
        },
      },
    },
  };
}
