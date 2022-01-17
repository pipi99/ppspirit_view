<template>
  <a-row style="height: 100%; padding: 5px" :gutter="0">
    <a-col :span="8" style="text-align: center">
      <div>选择机构查询用户</div>
      <a-tree
        :fieldNames="organFiledNames"
        @select="onOrganTreeSelect"
        selectable
        :tree-data="organTreeData"
      >
        <template #title="{ organName }">
          {{ organName }}
        </template>
      </a-tree>
    </a-col>
    <a-col :span="8" style="text-align: center">
      <a-list item-layout="horizontal" :data-source="data" bordered>
        <template #header>
          <div>点击下方选项进行权限配置</div>
        </template>
        <template #renderItem="{ item }">
          <a-list-item @click="onclick(item)" class="item">
            <a-list-item-meta :description="item.description">
              <template #title>
                {{ item.userName }}
              </template>
              <!-- <template #avatar>
            <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </template> -->
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
    <a-col :span="8">
      <a-descriptions title="权限配置">
        <a-descriptions-item label="用户名称">{{ selectUser.userName }}</a-descriptions-item>
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
    name: 'PPUserPermissionComponent',
    setup() {
      const filedNames = ref({ children: 'children', title: 'title', key: 'permissionId' });
      const organFiledNames = ref({ children: 'children', title: 'organName', key: 'organId' });
      let data = ref([]);

      let treeData = ref([]);
      let organTreeData = ref([]);
      let selectUser = ref<any>({});
      const checkedKeys = ref<string[]>([]);
      const api = new PermissionApi();

      //获取组织机构树
      const getOrganTreeDataList = () => {
        defHttp
          .post({
            url: '/sys/organ/treeList',
          })
          .then((_data) => {
            organTreeData.value = _data;
          });
      };

      //系统加载数据
      const getList = (orgId) => {
        defHttp
          .post({
            url: '/sys/user/list',
            data: { orgId: orgId },
          })
          .then((_data) => {
            console.log(_data);
            data.value = _data;
          });
      };

      //获取当前对象的权限
      const getById = (id) => {
        defHttp
          .get({
            url: '/sys/user/getByIdJpa/' + id,
          })
          .then((_data) => {
            selectUser.value = _data;
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

      //点击机构数查询用户
      const onOrganTreeSelect = (item) => {
        checkedKeys.value = [];
        treeData.value = [];
        selectUser.value = {};
        getList(item[0]);
      };

      //点击获取权限
      const onclick = async (item) => {
        await getAllPermissionList();
        await getById(item.userId);
      };

      onMounted(() => {
        getOrganTreeDataList();
      });

      //勾选树的时候，赋予权限
      const onTreeCheck = (_checkedKeys) => {
        if (!selectUser.value.userId) {
          message.warning('请选择角色!');
          return;
        }
        //自动保存
        let ownerPermissions = _checkedKeys.map((permissionId: any) => {
          return {
            ownerId: selectUser.value.userId,
            permissionId: permissionId,
          };
        });

        if (ownerPermissions && ownerPermissions.length > 0) {
          api.savePermission(ownerPermissions);
        } else {
          api.removePermission(selectUser.value.userId);
        }
      };

      return {
        filedNames,
        organFiledNames,
        treeData,
        organTreeData,
        checkedKeys,
        data,
        selectUser,
        onTreeCheck,
        onclick,
        onOrganTreeSelect,
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
