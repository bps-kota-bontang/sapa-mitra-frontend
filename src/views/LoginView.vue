<template>
  <div class="container">
    <el-card
      style="
        width: 480px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 5px;
        border-radius: 30px;
      "
    >
      <el-text style="font-size: 22pt; font-weight: 500"
        >Selamat Datang! 👋</el-text
      >
      <el-form
        @submit.prevent
        style="margin-top: 15px"
        :rules="rules"
        ref="formRef"
        v-loading="loading"
        :model="form"
        label-width="auto"
        label-position="top"
      >
        <el-form-item label="Email" required prop="email">
          <el-input
            @keyup.enter="login(formRef)"
            size="large"
            v-model="form.email"
            type="email"
            placeholder="Masukkan Email"
          />
        </el-form-item>
        <el-form-item label="Password" required prop="password">
          <el-input
            @keyup.enter="login(formRef)"
            size="large"
            v-model="form.password"
            type="password"
            placeholder="Masukkan Password"
          />
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            @click="login(formRef)"
            >Login</el-button
          >
        </el-form-item>
      </el-form>
      <div style="display: flex; align-items: center">
        <el-divider style="margin-right: 10px"></el-divider>
        <span style="margin: 0 10px">OR</span>
        <el-divider style="margin-left: 10px"></el-divider>
      </div>

      <el-button
        size="large"
        style="margin-top: 18px; width: 100%"
        @click="login(formRef)"
        ><IconBPS style="width: 1.9em; height: 1.9em; margin-right: 10px" />
        Login with SSO BPS</el-button
      >
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { Delete, Edit, Search, Share, Upload } from "@element-plus/icons-vue";

const initialState = {
  email: "",
  password: "",
};

const rules = reactive<FormRules<any>>({
  email: [
    {
      required: true,
      message: "Email perlu terisi",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "Password perlu terisi",
      trigger: "blur",
    },
  ],
});

const formRef = ref<FormInstance>();
const form = reactive({ ...initialState });

const auth = useAuthStore();
const loading = ref(false);
const error = ref("");
const feedback = ref({
  title: "",
  message: "",
  type: "",
});

const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    loading.value = true;
    error.value = "";

    if (!valid) {
      loading.value = false;
      return;
    }

    try {
      const { data, message } = await auth.login(form);
      feedback.value = {
        title: "Success",
        message: message,
        type: "success",
      };
    } catch (e) {
      if (e instanceof Error) {
        feedback.value = {
          title: "Error",
          message: e.message,
          type: "error",
        };
      }
    } finally {
      loading.value = false;
    }
  });
};

watch(
  () => feedback.value,
  (feedback: any) => {
    if (feedback.message != "") {
      ElNotification({
        title: feedback.title,
        message: feedback.message,
        type: feedback.type,
      });
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(
    --el-color-primary-light-5
  ); /* Example background color */
}

.card {
  max-width: 480px;
}
</style>
