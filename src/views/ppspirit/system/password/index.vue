<template>
  <PageWrapper title="修改当前用户密码" content="修改成功后会自动退出当前登录！">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <!-- <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div> -->
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useUserStore } from '/@/store/modules/user';

  import { defHttp } from '/@/utils/http/axios';
  import { formSchema } from './pwd.data';
  import { ContentTypeEnum } from '/@/enums/httpEnum';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper },
    setup() {
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          const { passwordOld, passwordNew } = values;
          defHttp
            .post({
              url: '/sys/auth/resetPwd/',
              data: `oldPwd=${passwordOld}&newPwd=${passwordNew}`,
              headers: {
                'Content-type': ContentTypeEnum.FORM_URLENCODED,
              },
            })
            .then((_data) => {
              message.success(_data);
              const userStore = useUserStore();
              userStore.logout(true);
            });
          // TODO custom api
          // console.log(passwordOld, passwordNew);
          // const { router } = useRouter();
          // router.push(pageEnum.BASE_LOGIN);
        } catch (error) {}
      }

      return { register, resetFields, handleSubmit };
    },
  });
</script>
