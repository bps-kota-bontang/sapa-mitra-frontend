<template>
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="auto" label-position="top">
    <el-form-item required label="Nama" prop="name">
      <el-input v-model="form.name" placeholder="Masukkan Nama Partner" />
    </el-form-item>
    <el-form-item required label="NIK" prop="nik">
      <el-input v-model="form.nik" type="number" placeholder="Masukkan NIK Partner" />
    </el-form-item>
    <el-form-item required label="Alamat" prop="address">
      <el-input v-model="form.address" placeholder="Masukkan Alamat Partner" />
    </el-form-item>

    <el-form-item required style="margin-top: 20px">
      <el-button @click="submit(formRef)" type="primary">Tambah</el-button>
      <el-button @click="reset(formRef)">Bersihkan</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import { createPartner } from "@/api/partnerApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<any>>({
  name: [
    {
      required: true,
      message: "Nama mitra perlu terisi",
      trigger: "blur",
    },
  ],
  nik: [
    {
      required: true,
      message: "NIK mitra perlu terisi",
      trigger: "blur",
    },
    { min: 16, max: 16, message: "NIK harus 16 digit", trigger: "blur" },
  ],
  address: [
    {
      required: true,
      message: "Alamat mitra perlu terisi",
      trigger: "blur",
    },
  ],
});

const initialState = {
  name: "",
  nik: "",
  address: "",
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
      const { data, message } = await createPartner(form);
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
