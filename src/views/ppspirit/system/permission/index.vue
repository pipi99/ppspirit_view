<template>
  <div style="height: 100%">
    <a-row style="height: 100%" :gutter="0">
      <a-col :span="12">
        <a-tabs v-model:activeKey="activeKey" tab-position="top">
          <a-tab-pane key="1" tab="角色权限">
            <role-permission />
          </a-tab-pane>
          <a-tab-pane key="2" tab="组权限">
            <group-permission />
          </a-tab-pane>
          <a-tab-pane key="3" tab="用户权限">
            <user-permission />
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="12">
        <fs-crud ref="crudRef" v-bind="crudBinding" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { message, Modal } from 'ant-design-vue';

  import GroupPermission from './group/index.vue';
  import RolePermission from './role/index.vue';
  import UserPermission from './user/index.vue';

  export default defineComponent({
    name: 'PPPermissionComponent',
    components: { GroupPermission, RolePermission, UserPermission },
    setup() {
      const activeKey = ref('1');
      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();
      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions, selectedRowKeys, batchDelRequest } = createCrudOptions({ expose });
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
        handleBatchDelete,
        activeKey,
      };
    },
  });
</script>
