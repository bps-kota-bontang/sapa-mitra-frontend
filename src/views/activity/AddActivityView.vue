<template>
  <el-form
    ref="formRef"
    v-loading="loading"
    :model="form"
    :rules="rules"
    label-width="auto"
    label-position="top"
  >
    <el-form-item required label="Nama" prop="name">
      <el-input
        v-model="form.name"
        placeholder="Masukkan Nama Kegiatan"
      />
    </el-form-item>
    <el-form-item required label="Kode" prop="code">
      <el-input
        v-model="form.code"
        placeholder="Masukkan Kode Kegiatan"
      />
    </el-form-item>

    <el-form-item required style="margin-top: 20px">
      <el-button @click="submit(formRef)" type="primary">Tambah</el-button>
      <el-button @click="reset(formRef)">Bersihkan</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import { createActivity } from "@/api/activityApi";
import type { FormInstance, FormRules } from "element-plus";

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<any>>({
  name: [
    {
      required: true,
      message: "Nama kegiatan perlu terisi",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "Kode kegiatan perlu terisi",
      trigger: "blur",
    },
  ],
});

const initialState = {
  name: "",
  code: "",
};

let feedback = ref({
  title: "",
  message: "",
  type: "",
});
const loading = ref(false);
const form = reactive({ ...initialState });

const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    loading.value = true;

    if (!valid) {
      loading.value = false;
      return;
    }

    try {
      const { data, message } = await createActivity(form);
      feedback.value = {
        title: "Success",
        message: message,
        type: "success",
      };

      if (formRef.value) {
        formRef.value.resetFields();
      }
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
