<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
    <a-modal
      v-model:visible="showMenuAllSelectModalVisible"
      title="选择菜单"
      width="1000px"
      :footer="null"
    >
      <div style="height: 600px"><select-menu-all @select-my="selectrow" /></div>
    </a-modal>
  </fs-page>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import SelectMenuAll from './selectMenuAll/index.vue';
  import FsPage from '@fast-crud/fast-crud/src/components/container/fs-page.vue';
  export default defineComponent({
    name: 'PPMenuComponent',
    components: { SelectMenuAll, FsPage },
    setup() {
      //菜单库选择框显示
      const showMenuAllSelectModalVisible = ref(false);

      const showMenuAllSelectModal = () => {
        showMenuAllSelectModalVisible.value = true;
      };

      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();
      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({
        expose,
        showMenuAllSelectModal,
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

      const selectrow = (row) => {
        console.log(row);

        //菜单名称
        const formdata = expose.getFormData();
        formdata.menuName = row.menuName;
        formdata.path = row.target;
        formdata.description = row.description;
        formdata.icon = row.icon;

        formdata.isComponent = row.isComponent;
        if (row.isComponent == 1) {
          formdata.target = row.target;
        }

        showMenuAllSelectModalVisible.value = false;
      };

      return {
        selectrow,
        crudBinding,
        crudRef,
        showMenuAllSelectModalVisible,
      };
    },
  });
</script>
