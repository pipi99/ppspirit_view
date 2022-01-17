import { ref } from 'vue';
import { compute } from '@fast-crud/fast-crud';
import { RoleApi } from './api';
// 构建crudOptions的方法
export default function ({ expose }) {
  const api = new RoleApi();
  const pageRequest = async (query) => {
    return await api.GetPageList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.roleId = row.roleId;
    form = prependRole_(form);
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.roleId);
  };
  const batchDelRequest = async (ids) => {
    return await api.BatchDelete(ids);
  };

  const addRequest = async ({ form }) => {
    //
    form = prependRole_(form);
    return await api.AddObj(form);
  };
  const selectedRowKeys = ref([]);

  const prependRole_ = (form) => {
    if (form.roleName.indexOf('ROLE_') != 0) {
      form.roleName = 'ROLE_' + form.roleName;
    }
    return form;
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
      table: {
        rowKey: 'roleId',
        // rowSelection: {
        //   selectedRowKeys: selectedRowKeys,
        //   onChange: onSelectChange,
        // },
      },
      rowHandle: {
        buttons: {
          edit: {
            show: compute((context) => {
              return (
                context.row.roleName !== 'ROLE_SUPER_ADMINISTRATOR' &&
                context.row.roleName !== 'ROLE_ADMINISTRATOR' &&
                context.row.roleName !== 'ROLE_GUEST' &&
                context.row.roleName !== 'ROLE_ANONYMOUS'
              );
            }),
          },
          remove: {
            show: compute((context) => {
              return (
                context.row.roleName !== 'ROLE_SUPER_ADMINISTRATOR' &&
                context.row.roleName !== 'ROLE_ADMINISTRATOR' &&
                context.row.roleName !== 'ROLE_GUEST' &&
                context.row.roleName !== 'ROLE_ANONYMOUS'
              );
            }),
          },
        },
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
        // roleId: {
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
        roleName: {
          title: '角色编号',
          form: {
            helper: '系统会判断是否 ROLE_  开头，如不是，保存的时候会自动追加',
            rules: [
              { required: true, message: '请输入角色编号' },
              { max: 32, message: '请输入角色编号,最大长度32' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        roleAlias: {
          title: '角色名称',
          form: {
            rules: [
              { required: true, message: '请输入角色名称' },
              { max: 32, message: '请输入角色名称,最大长度32' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        description: {
          title: '角色说明',
          form: {
            rules: [{ max: 100, message: '最大长度100' }],
          },
          type: 'text',
          column: {
            width: 180,
          },
        },
      },
    },
  };
}
