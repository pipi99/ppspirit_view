import { ref } from 'vue';
import { dict } from '@fast-crud/fast-crud';
import { GroupApi } from './api';
import { defHttp } from '/@/utils/http/axios';
// 构建crudOptions的方法
export default function ({ expose }) {
  const api = new GroupApi();
  const pageRequest = async (query) => {
    return await api.GetPagelistJpa(query);
  };
  const editRequest = async ({ form, row }) => {
    form.groupId = row.groupId;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.groupId);
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
        rowKey: 'groupId',
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
        // groupId: {
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
        groupName: {
          title: '组名称',
          form: {
            rules: [
              { required: true, message: '请输入组名称' },
              { max: 32, message: '请输入组名称,最大长度32' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
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
        description: {
          title: '组说明',
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
