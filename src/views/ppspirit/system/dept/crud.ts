import { ref } from 'vue';
import { dict } from '@fast-crud/fast-crud';
import { DeptApi } from './api';

import { defHttp } from '/@/utils/http/axios';
// 构建crudOptions的方法
export default function ({}) {
  const api = new DeptApi();
  const pageRequest = async (query) => {
    return await api.pageTreeList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.organId = row.organId;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.organId);
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
        rowKey: 'organId',
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
        //     width: 100,
        //     columnSetDisabled: true, //禁止在列设置中选择
        //     formatter: (context) => {
        //       //计算序号,你可以自定义计算规则，此处为翻页累加
        //       const index = context.index ?? 1;
        //       const pagination = expose.crudBinding.value.pagination;
        //       return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
        //     },
        //   },
        // },
        // organId: {
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
        organName: {
          title: '组织名称',
          form: {
            rules: [
              { required: true, message: '请输入组织名称' },
              { min: 1, max: 100, message: '请输入组织名称,最大长度100' },
            ],
          },
          search: { show: true },
          type: 'text',
          column: {
            width: 180,
          },
        },
        parentId: {
          title: '上级机构',
          type: 'dict-tree',
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
          },
          column: {
            show: false,
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
        organLevel: {
          title: '组织级别',
          form: {
            rules: [{ required: true, message: '请选择组织级别' }],
          },
          type: 'dict-select',
          dict: dict({
            url: '/sys/dict/getDictByTypeCode/ORGAN_LEVEL',
            value: 'dictCode',
            label: 'dictName',
          }),
          column: {
            width: 180,
          },
        },
        organType: {
          title: '组织类型',
          form: {
            rules: [{ required: true, message: '请选择组织类型' }],
          },
          type: 'dict-select',
          dict: dict({
            url: '/sys/dict/getDictByTypeCode/ORGAN_TYPE',
            value: 'dictCode',
            label: 'dictName',
          }),
          column: {
            width: 100,
          },
        },
        actual: {
          title: '节点类型',
          form: {
            rules: [{ required: true, message: '请选择' }],
          },
          type: 'dict-select',
          dict: dict({
            data: [
              { value: 1, label: '组织机构' },
              { value: 0, label: '虚拟节点' },
            ],
          }),
          column: {
            width: 100,
          },
        },
        enabled: {
          title: '是否启用',
          form: {
            rules: [{ required: true, message: '请选择' }],
          },
          type: 'dict-select',
          dict: dict({
            data: [
              { value: 1, label: '是' },
              { value: 0, label: '否' },
            ],
          }),
          column: {
            width: 100,
          },
        },
        description: {
          title: '组织描述',
          form: {
            rules: [{ max: 100, message: '组织描述最大长度100' }],
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
