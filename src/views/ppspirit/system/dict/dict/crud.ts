import { ref } from 'vue';
import { dict } from '@fast-crud/fast-crud';
import { DictApi } from './api';
import { defHttp } from '/@/utils/http/axios';
// 构建crudOptions的方法
export default function ({ expose }) {
  const api = new DictApi();
  const pageRequest = async (query) => {
    return await api.GetPageList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.dictId = row.dictId;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.dictId);
  };
  const batchDelRequest = async (ids) => {
    return await api.BatchDelete(ids);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  const selectedRowKeys = ref([]);

  const onSelectChange = (changed) => {
    console.log('selection', changed);
    selectedRowKeys.value = changed;
  };
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
        rowKey: 'dictId',
        rowSelection: {
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
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
        // dictId: {
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
        dictName: {
          title: '字典名称',
          helper: '最大长度200',
          form: {
            rules: [
              { required: true, message: '请输入字典名称' },
              { min: 1, max: 100, message: '请输入字典名称,最大长度100' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        dictCode: {
          title: '字典编号',
          form: {
            helper: '最大长度200，字母数字下划线组合',
            rules: [
              { required: true, message: '请输入字典编号' },
              { min: 1, max: 100, message: '请输入字典编号,最大长度100' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        dictTypeCode: {
          title: '所属类型',
          form: {
            rules: [{ required: true, message: '请选择' }],
          },
          search: { show: true },
          type: 'dict-select',
          dict: dict({
            async getData(dict) {
              return defHttp.post({
                url: dict.url,
              });
            },
            url: '/sys/dicttype/list',
            value: 'dictTypeCode',
            label: 'dictTypeName',
          }),
          column: {
            width: 180,
          },
        },
      },
    },
  };
}
