import { ref } from 'vue';
import Api from './api';
// 构建crudOptions的方法
export default function ({ expose }) {
  const api = new Api();
  const pageRequest = async (query) => {
    return await api.GetPageList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.menuId = row.menuId;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.menuId);
  };
  const batchDelRequest = async (ids) => {
    return await api.BatchDelete(ids);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  const selectedRowKeys = ref([]);

  // const onSelectChange = (changed) => {
  //   console.log('selection', changed);
  //   selectedRowKeys.value = changed;
  // };
  return {
    selectedRowKeys, //返回给index.vue去使用
    batchDelRequest, //返回给index.vue去使用
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      table: {
        rowKey: 'menuId',
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
        // menuId: {
        //   title: 'ID',
        //   key: 'id',
        //   type: 'number',
        //   column: {
        //     width: 180,
        //   },
        //   form: {
        //     show: false,
        //   },
        // },
        menuName: {
          title: '菜单名称',
          search: { show: true },
          type: 'text',
          form: {
            helper: '菜单名称,最大长度100',
            rules: [{ required: true, message: '请输入菜单名称' }],
            component: {
              maxlength: 100, // 原生属性要写在这里
              props: {
                type: 'text',
                showWordLimit: true,
              },
            },
          },
          column: {
            width: 180,
          },
        },
        // icon: {
        //   title: '图标',
        //   type: 'text',
        //   column: {
        //     width: 180,
        //     component: {
        //       name: 'fs-icon',
        //       vModel: 'icon',
        //       style: 'font-size:18px',
        //     },
        //   },
        // },
        path: {
          title: '菜单地址',
          type: 'text',
          form: {
            helper: '菜单地址,最大长度1000',
            rules: [{ required: true, message: '请输入菜单名称' }],
            component: {
              maxlength: 1000, // 原生属性要写在这里
              props: {
                type: 'text',
                showWordLimit: true,
              },
            },
          },
          column: {
            width: 180,
          },
        },
        description: {
          title: '菜单描述',
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
      },
    },
  };
}
