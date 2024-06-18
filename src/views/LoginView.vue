<template>
  <el-form
    ref="formRef"
    v-loading="loading"
    :model="form"
    label-width="auto"
    label-position="top"
  >
    <el-form-item label="Email" prop="email">
      <el-input
        v-model="form.email"
        type="email"
        placeholder="Masukkan Email"
      />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Masukkan Password"
      />
    </el-form-item>
  </el-form>
  <el-button @click="login">Login</el-button>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const initialState = {
  email: "",
  password: "",
};

const formRef = ref<FormInstance>();
const form = reactive({ ...initialState });
const router = useRouter();

const user = useUserStore();
const loading = ref(false);
const error = ref("");
const feedback = ref({
  title: "",
  message: "",
  type: "",
});

const login = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { data, message } = await user.login(form);
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
