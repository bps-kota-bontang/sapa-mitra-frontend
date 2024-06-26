<template>
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
      >Data Pejabat Pembuat Komitmen</el-text
    >
    <el-form
      @submit.prevent
      style="margin-top: 15px"
      :rules="rules"
      ref="formPpkRef"
      v-loading="loading"
      :model="form"
      label-width="auto"
      label-position="top"
    >
      <el-form-item label="Nama" required prop="name">
        <el-input
          @keyup.enter="save(formPpkRef)"
          size="large"
          v-model="form.name"
          placeholder="Masukkan Nama"
        />
      </el-form-item>
      <el-form-item label="NIP" required prop="nip">
        <el-input
          @keyup.enter="save(formPpkRef)"
          size="large"
          v-model="form.nip"
          placeholder="Masukkan NIP"
        />
      </el-form-item>
      <el-form-item label="Alamat" required prop="address">
        <el-input
          @keyup.enter="save(formPpkRef)"
          size="large"
          v-model="form.address"
          placeholder="Masukkan Alamat"
        />
      </el-form-item>
      <el-form-item style="margin-top: 30px">
        <el-button
          type="primary"
          size="large"
          style="width: 100%"
          @click="save(formPpkRef)"
          >Simpan</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { getAuthority, createConfiguration } from "@/api/configurationApi";

const initialState = {
  name: "",
  nip: "",
  address: "",
};

const rules = reactive<FormRules<any>>({
  name: [
    {
      required: true,
      message: "Nama perlu terisi",
      trigger: "blur",
    },
  ],
  nip: [
    {
      required: true,
      message: "NIP perlu terisi",
      trigger: "blur",
    },
  ],
  address: [
    {
      required: true,
      message: "Alamat perlu terisi",
      trigger: "blur",
    },
  ],
});

const formPpkRef = ref<FormInstance>();
const form = reactive({ ...initialState });
const loading = ref(false);
const error = ref("");
const feedback = ref({
  title: "",
  message: "",
  type: "",
});

const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    loading.value = true;
    error.value = "";

    if (!valid) {
      loading.value = false;
      return;
    }

    try {
      const { data, message } = await createConfiguration(form);
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

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data, message } = await getAuthority();
    Object.assign(form, data.value);
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
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

onMounted(async () => {
  await fetchData();
});
</script>
