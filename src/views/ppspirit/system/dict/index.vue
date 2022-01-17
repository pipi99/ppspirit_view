<template>
  <fs-page style="height: 100%">
    <a-row class="demo-nest" :gutter="0">
      <a-col :span="12">
        <fs-crud ref="crudRef" v-bind="crudBinding" />
      </a-col>
      <a-col :span="12">
        <dict-table ref="dictTableRef" />
      </a-col>
    </a-row>
  </fs-page>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { message, Modal } from 'ant-design-vue';
  import DictTable from './dict/index.vue';

  export default defineComponent({
    name: 'PPDictTypeComponent',
    components: { DictTable },
    setup() {
      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();

      // //字典子表的ref
      const dictTableRef = ref();

      // const { crudOptions } = createCrudOptions({ expose, dictTableRef });
      // // 初始化crud配置
      // // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      // const { resetCrudOptions } = useCrud({ expose, crudOptions });

      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions, selectedRowKeys, batchDelRequest } = createCrudOptions({
        expose,
        dictTableRef,
      });
      // 初始化crud配置
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      const { resetCrudOptions } = useCrud({ expose, crudOptions });
      // 你可以调用此方法，重新初始化crud配置
      // resetCrudOptions(options)

      // 页面打开后获取列表数据
      onMounted(() => {
        expose.doRefresh();
      });

      const handleBatchDelete = () => {
        if (selectedRowKeys.value?.length > 0) {
          Modal.confirm({
            title: '确认',
            content: `确定要批量删除这${selectedRowKeys.value.length}条记录吗`,
            async onOk() {
              await batchDelRequest(selectedRowKeys.value);
              message.info('删除成功');
              expose.doRefresh();
              selectedRowKeys.value = [];
            },
          });
        } else {
          message.error('请先勾选记录');
        }
      };

      return {
        crudBinding,
        crudRef,
        dictTableRef,
        handleBatchDelete,
      };
    },
  });
</script>
<style lang="less">
  .demo-nest {
    height: 100%;
    width: 100%;
  }
</style>
