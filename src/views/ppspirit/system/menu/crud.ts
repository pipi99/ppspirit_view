import { ref } from 'vue';
import { dict, compute } from '@fast-crud/fast-crud';
import { defHttp } from '/@/utils/http/axios';
import { MenuApi } from './api';
// 构建crudOptions的方法
export default function ({}) {
  const api = new MenuApi();
  const pageRequest = async (query) => {
    return await api.pageTreeList(query);
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
        rowKey: 'menuId',
        // rowSelection: {
        //   selectedRowKeys: selectedRowKeys,
        //   onChange: onSelectChange,
        // },
      },
      columns: {
        // _index: {
        //   title: '序号',
        //   form: { show: false },
        //   column: {
        //     // type: "index",
        //     align: 'left',
        //     width: '155px',
        //     columnSetDisabled: true, //禁止在列设置中选择
        //     formatter: (context) => {
        //       //计算序号,你可以自定义计算规则，此处为翻页累加
        //       const index = context.index ?? 1;
        //       const pagination = expose.crudBinding.value.pagination;
        //       return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
        //     },
        //   },
        // },
        // menuId: {
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
        isMenu: {
          title: '菜单类型',
          type: 'dict-select',

          form: {
            rules: [{ required: true, message: '请选择' }],
          },
          dict: dict({
            data: [
              { value: 1, label: '菜单' },
              { value: 0, label: '目录' },
            ],
          }),
          column: {
            order: 3,
            width: 120,
          },
        },
        menuName: {
          title: '菜单名称',
          search: { show: true },
          form: {
            rules: [
              { required: true, message: '请输入菜单名称' },
              { max: 100, message: '请输入权限标识,最大长度100' },
            ],
          },
          type: 'text',
          column: {
            width: 180,
          },
        },
        // icon: {
        //   title: '图标',
        //   type: 'text',
        //   column: {
        //     component: {
        //       name: 'fs-icon',
        //       vModel: 'icon',
        //       style: 'font-size:18px',
        //     },
        //   },
        // },
        parentId: {
          title: '上级菜单',
          type: 'dict-tree',
          dict: dict({
            async getData(dict) {
              return defHttp.post({
                url: dict.url,
              });
            },
            value: 'menuId',
            label: 'menuName',
            url: '/sys/menu/dirTreeList',
            isTree: true,
          }),
          form: {
            component: {
              fieldNames: { label: 'menuName', key: 'menuId', value: 'menuId' },
            },
          },
          column: {
            show: false,
            width: 180,
          },
        },
        path: {
          title: '菜单地址',
          type: 'text',
          form: {
            rules: [
              { required: true, message: '请输入菜单地址' },
              { max: 1000, message: '最大长度1000' },
            ],
            show: compute((context) => {
              return context.form.isMenu === 1;
            }),
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
        enabled: {
          title: '是否启用',
          type: 'dict-select',
          form: {
            rules: [{ required: true, message: '请选择' }],
          },
          dict: dict({
            data: [
              { value: 1, label: '是' },
              { value: 0, label: '否' },
            ],
          }),
          column: {
            width: 120,
          },
        },
        inFrame: {
          title: '打开方式',
          type: 'dict-select',
          form: {
            rules: [{ required: true, message: '请选择' }],

            show: compute((context) => {
              return context.form.isMenu === 1;
            }),
          },
          dict: dict({
            data: [
              { value: 1, label: '框架内打开' },
              { value: 0, label: '新窗口' },
            ],
          }),
          column: {
            width: 120,
          },
        },
        accessCtrl: {
          title: '访问控制',
          type: 'dict-select',
          form: {
            rules: [{ required: true, message: '请选择' }],
          },
          dict: dict({
            data: [
              { value: 0, label: '匿名访问' },
              { value: 1, label: '登录访问' },
              { value: 2, label: '授权访问' },
            ],
          }),
          column: {
            width: 120,
          },
        },
      },
    },
  };
}
