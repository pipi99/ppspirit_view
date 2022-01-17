<template>
  <a-row style="height: 100%; padding: 5px" :gutter="0">
    <a-col :span="8" style="text-align: center">
      <a-list item-layout="horizontal" :data-source="data" bordered>
        <template #header>
          <div>点击下方选项进行权限配置</div>
        </template>
        <template #renderItem="{ item }">
          <a-list-item @click="onclick(item)" class="item">
            <a-list-item-meta :description="item.description">
              <template #title>
                {{ item.groupName }}
              </template>
              <!-- <template #avatar>
            <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </template> -->
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
    <a-col :span="16">
      <a-descriptions title="权限配置">
        <a-descriptions-item label="用户组名称">{{ selectGroup.groupName }}</a-descriptions-item>
        <a-descriptions-item label="用户组说明">{{ selectGroup.description }}</a-descriptions-item>
      </a-descriptions>
      <a-tree
        :fieldNames="filedNames"
        @check="onTreeCheck"
        v-model:checkedKeys="checkedKeys"
        checkable
        :selectable="false"
        :tree-data="treeData"
      >
        <template #title="{ remark }">
          {{ remark }}
        </template>
      </a-tree>
    </a-col>
  </a-row>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { PermissionApi } from '../api';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'PPGroupPermissionComponent',
    setup() {
      const filedNames = ref({ children: 'children', title: 'title', key: 'permissionId' });
      let data = ref([]);
      let treeData = ref([]);
      let selectGroup = ref<any>({});
      const checkedKeys = ref<string[]>([]);
      const api = new PermissionApi();
      //系统加载数据
      const getList = () => {
        defHttp
          .post({
            url: '/sys/group/list',
          })
          .then((_data) => {
            console.log(_data);
            data.value = _data;
          });
      };

      const getById = (id) => {
        defHttp
          .get({
            url: '/sys/group/getByIdJpa/' + id,
          })
          .then((_data) => {
            selectGroup.value = _data;
            const permissions = _data.permissions;
            if (permissions && permissions.length > 0) {
              checkedKeys.value = permissions.map((permission) => {
                return permission.permissionId;
              });
            } else {
              checkedKeys.value = [];
            }
          });
      };

      const getAllPermissionList = () => {
        api.getAllPermissionList().then((_data) => {
          treeData.value = _data;
        });
      };

      //点击获取权限
      const onclick = async (item) => {
        await getAllPermissionList();
        await getById(item.groupId);
      };

      onMounted(() => {
        getList();
      });

      //勾选树的时候，赋予权限
      const onTreeCheck = (_checkedKeys) => {
        if (!selectGroup.value.groupId) {
          message.warning('请选择组!');
          return;
        }
        //自动保存
        let ownerPermissions = _checkedKeys.map((permissionId: any) => {
          return {
            ownerId: selectGroup.value.groupId,
            permissionId: permissionId,
          };
        });

        if (ownerPermissions && ownerPermissions.length > 0) {
          api.savePermission(ownerPermissions);
        } else {
          api.removePermission(selectGroup.value.groupId);
        }
      };

      return {
        filedNames,
        treeData,
        checkedKeys,
        data,
        selectGroup,
        onTreeCheck,
        onclick,
        getAllPermissionList,
        getList,
        getById,
      };
    },
  });
</script>
<style lang="less" scoped>
  .item {
    cursor: pointer;
  }

  .item:hover {
    background-color: #1890ff;
  }

  .ant-col {
    padding: 5px;
  }
</style>
