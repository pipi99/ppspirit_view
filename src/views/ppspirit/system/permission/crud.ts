import { ref } from 'vue';
import { dict, compute } from '@fast-crud/fast-crud';
import { PermissionApi } from './api';
// 构建crudOptions的方法
export default function ({ expose }) {
  const api = new PermissionApi();
  const pageRequest = async (query) => {
    return await api.GetPageList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.permissionId = row.permissionId;
    form = prependPermission_(form);
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.permissionId);
  };
  const batchDelRequest = async (ids) => {
    return await api.BatchDelete(ids);
  };

  const addRequest = async ({ form }) => {
    form = prependPermission_(form);
    form.resourceType = 'customize';
    return await api.AddObj(form);
  };

  const prependPermission_ = (form) => {
    if (form.permission.indexOf('PERMISSION_') != 0) {
      form.permission = 'PERMISSION_' + form.permission;
    }
    return form;
  };

  const selectedRowKeys = ref([]);

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
        rowKey: 'permissionId',
        // rowSelection: {
        //   selectedRowKeys: selectedRowKeys,
        //   onChange: onSelectChange,
        // },
      },
      rowHandle: {
        buttons: {
          edit: {
            show: compute((context) => {
              return context.row.resourceType === 'customize';
            }),
          },
          remove: {
            show: compute((context) => {
              return context.row.resourceType === 'customize';
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
        // permissionId: {
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
        remark: {
          title: '权限名称',
          search: { show: true },
          type: 'text',
          form: {
            rules: [
              { required: true, message: '请输入权限名称' },
              { max: 100, message: '请输入权限名称,最大长度100' },
            ],
          },
          column: {
            width: 180,
          },
        },
        permission: {
          title: '权限标识',
          search: { show: true },
          type: 'text',
          form: {
            helper: '以 PERMISSION_  开头,如不是，系统会自动追加',
            rules: [
              { required: true, message: '请输入权限标识' },
              { max: 100, message: '请输入权限标识,最大长度100' },
            ],
          },
          column: {
            width: 180,
          },
        },
        resourceType: {
          title: '权限类型',
          search: { show: true },
          dict: dict({
            data: [
              { value: 'menu', label: '菜单权限' },
              { value: 'action', label: '按钮权限' },
              { value: 'customize', label: '其他权限' },
            ],
          }),
          form: {
            show: false,
          },
          type: 'dict-select',
          column: {
            width: 180,
          },
        },
      },
    },
  };
}
