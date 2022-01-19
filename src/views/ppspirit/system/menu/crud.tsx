import { ref } from 'vue';
import { dict, compute } from '@fast-crud/fast-crud';
import { defHttp } from '/@/utils/http/axios';
import { MenuApi } from './api';
// 构建crudOptions的方法
export default function ({ showMenuAllSelectModal }) {
  const api = new MenuApi();
  const pageRequest = async (query) => {
    query.orders = [{ column: 'sort', isAsc: true }];
    return await api.pageTreeList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.menuId = row.menuId;
    reSetValue(form);
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.menuId);
  };
  const batchDelRequest = async (ids) => {
    return await api.BatchDelete(ids);
  };

  const addRequest = async ({ form }) => {
    reSetValue(form);
    return await api.AddObj(form);
  };

  const selectedRowKeys = ref([]);

  const reSetValue = (from) => {
    // 目录
    if (from.isMenu == 0) {
      // 组件
      from.isComponent = 1;
      from.path = null;
      from.inFrame = null;
      from.target = 'LAYOUT';

      // 菜单
    } else {
      // 非组件
      if (from.isComponent == 0) {
        from.target = 'IFRAME';
      }
    }
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
        // }, 02
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
        isMenu: {
          title: '菜单类型',
          search: { show: true },
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 1, label: '菜单' },
              { value: 0, label: '目录' },
            ],
          }),
          form: {
            value: 1,
            rules: [{ required: true, message: '请选择' }],
            component: {
              optionName: 'a-radio-button',
            },
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
            suffixRender() {
              return (
                <a-button-group style={'padding-left:5px'}>
                  <a-button onClick={showMenuAllSelectModal}>选择</a-button>
                </a-button-group>
              );
            },
          },
          column: {
            width: 180,
          },
        },
        isComponent: {
          title: '是否路由',
          search: { show: true },
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 1, label: '是' },
              { value: 0, label: '否' },
            ],
          }),
          form: {
            value: 1,
            rules: [{ required: true, message: '请选择' }],
            component: {
              optionName: 'a-radio-button',
            },
            show: compute((context) => {
              return context.form.isMenu === 1;
            }),
          },
        },
        target: {
          title: '路由组件',
          type: 'text',
          form: {
            show: compute((context) => {
              return context.form.isComponent === 1 && context.form.isMenu === 1;
            }),
            helper:
              '相对 view 目录的vue组件的绝对地址（/ppspirit/system/menu/index.vue）写为： /ppspirit/system/menu/index',
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
        // isEnabled: {
        //   title: '是否启用',
        //   type: 'dict-select',
        //   form: {
        //     helper: '菜单可见，禁用或者启用状态',
        //     value: 1,
        //     rules: [{ required: true, message: '请选择' }],
        //   },
        //   dict: dict({
        //     data: [
        //       { value: 1, label: '是' },
        //       { value: 0, label: '否' },
        //     ],
        //   }),
        //   column: {
        //     width: 120,
        //   },
        // },
        isHidden: {
          title: '是否隐藏',
          type: 'dict-select',
          form: {
            helper: '菜单可见不可见',
            value: 0,
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
            helper: '弹框或者内嵌，只对非组件的链接有效',
            rules: [{ required: true, message: '请选择' }],
            value: 1,
            show: compute((context) => {
              return context.form.isMenu === 1 && context.form.isComponent === 0;
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
            helper:
              '登录访问：所有用户登录即可访问；授权访问：需要授权才可以访问；匿名访问：开放链接地址',
            value: 1,
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
        description: {
          title: '菜单描述',
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        sort: {
          title: '排序号',
          type: 'number',
          column: {
            width: 100,
          },
        },
      },
    },
  };
}
