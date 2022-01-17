import { ref } from 'vue';
import DictTypeApi from './api';
// 构建crudOptions的方法
export default function ({ expose, dictTableRef }) {
  const api = new DictTypeApi();
  const pageRequest = async (query) => {
    return await api.GetPageList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.dictTypeId = row.dictTypeId;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.dictTypeId);
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

  const currentRow = ref();
  const onCurrentRowChange = (_currentRow) => {
    currentRow.value = _currentRow.dictTypeId;
    dictTableRef.value.setSearchFormData({ form: { dictTypeCode: _currentRow.dictTypeCode } });
    dictTableRef.value.doRefresh();
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
        rowKey: 'dictTypeId',
        // rowSelection: {
        //   selectedRowKeys: selectedRowKeys,
        //   onChange: onSelectChange,
        // },
        customRow(record) {
          const clazz = record.dictTypeId === currentRow.value ? 'fs-current-row' : '';
          return {
            onClick() {
              onCurrentRowChange(record);
            },
            class: clazz,
          };
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
        dictTypeName: {
          title: '字典类型名称',
          form: {
            helper: '最大长度200',
            rules: [
              { required: true, message: '请输入字典类型名称' },
              { min: 1, max: 100, message: '请输入字典类型名称,最大长度100' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        dictTypeCode: {
          title: '字典类型编号',
          form: {
            helper: '最大长度200，字母数字下划线组合',
            rules: [
              { required: true, message: '请输入字典类型编号' },
              { min: 1, max: 100, message: '请输入字典类型编号,最大长度100' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        description: {
          title: '类型说明',
          form: {
            rules: [{ max: 100, message: '类型说明最大长度100' }],
          },
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
