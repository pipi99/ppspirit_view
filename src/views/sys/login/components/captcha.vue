<template>
  <div class="login-captcha" @click="refresh">
    <img class="base64" :src="base64" alt="" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { captcha } from '/@/api/sys/user';

  export default defineComponent({
    emits: ['update:modelValue', 'change'],

    setup(_, { emit }) {
      const base64 = ref('');

      const refresh = () => {
        captcha()
          .then(({ captchaId, data }: any) => {
            base64.value = data;

            emit('update:modelValue', captchaId);
            emit('change', {
              base64,
              captchaId,
            });
          })
          .catch((err: string) => {
            console.log(err);
          });
      };

      refresh();

      return {
        base64,
        refresh,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .login-captcha {
    display: inline;
    height: 36px;
    cursor: pointer;

    .svg {
      height: 100%;
    }

    .base64 {
      height: 100%;
      display: inline;
      vertical-align: top;
    }
  }
</style>
