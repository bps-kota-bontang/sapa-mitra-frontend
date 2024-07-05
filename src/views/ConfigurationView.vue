<template>
  <div style="display: flex; gap:30px">
    <el-card style="
      width: 480px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 10px;
      padding-bottom: 5px;
      border-radius: 30px;
    ">
      <el-text style="font-size: 22pt; font-weight: 500">Data Pejabat Pembuat Komitmen</el-text>
      <el-form @submit.prevent style="margin-top: 15px" :rules="rulesPpk" ref="formPpkRef" v-loading="loading"
        :model="formPpk" label-width="auto" label-position="top">
        <el-form-item label="Nama" required prop="name">
          <el-input @keyup.enter="save(formPpkRef, formPpk, 'AUTHORITY')" size="large" v-model="formPpk.name"
            placeholder="Masukkan Nama" />
        </el-form-item>
        <el-form-item label="NIP" required prop="nip">
          <el-input @keyup.enter="save(formPpkRef, formPpk, 'AUTHORITY')" size="large" v-model="formPpk.nip"
            placeholder="Masukkan NIP" />
        </el-form-item>
        <el-form-item label="Alamat" required prop="address">
          <el-input @keyup.enter="save(formPpkRef, formPpk, 'AUTHORITY')" size="large" v-model="formPpk.address"
            placeholder="Masukkan Alamat" />
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" size="large" style="width: 100%"
            @click="save(formPpkRef, formPpk, 'AUTHORITY')">Simpan</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="
      width: 480px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 10px;
      padding-bottom: 5px;
      border-radius: 30px;
    ">
      <el-text style="font-size: 22pt; font-weight: 500">Data Batas Atas Honor</el-text>
      <el-form @submit.prevent style="margin-top: 15px" :rules="rulesRate" ref="formRateRef" v-loading="loading"
        :model="formRate" label-width="auto" label-position="top">
        <el-form-item label="Pencacahan" required prop="enumeration">
          <el-input @keyup.enter="save(formRateRef, formRate, 'RATE')" size="large" v-model="formRate.enumeration"
            placeholder="Masukkan batas atas honor pencacahan" />
        </el-form-item>
        <el-form-item label="Pemeriksaan" required prop="supervision">
          <el-input @keyup.enter="save(formRateRef, formRate, 'RATE')" size="large" v-model="formRate.supervision"
            placeholder="Masukkan batas atas honor pemeriksaan" />
        </el-form-item>
        <el-form-item label="Pengolahan" required prop="processing">
          <el-input @keyup.enter="save(formRateRef, formRate, 'RATE')" size="large" v-model="formRate.processing"
            placeholder="Masukkan batas atas honor pengolahan" />
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" size="large" style="width: 100%"
            @click="save(formRateRef, formRate, 'RATE')">Simpan</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { getAuthority, createConfiguration, getRate } from "@/api/configurationApi";

const initialStatePpk = {
  name: "",
  nip: "",
  address: "",
};

const initialStateRate = {
  enumeration: "",
  supervision: "",
  processing: "",
};

const rulesPpk = reactive<FormRules<any>>({
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

const rulesRate = reactive<FormRules<any>>({
  enumeration: [
    {
      required: true,
      message: "Batas atas honor pencacahan perlu terisi",
      trigger: "blur",
    },
  ],
  supervision: [
    {
      required: true,
      message: "Batas atas honor pemeriksaan perlu terisi",
      trigger: "blur",
    },
  ],
  processing: [
    {
      required: true,
      message: "Batas atas honor pengolahan perlu terisi",
      trigger: "blur",
    },
  ],
});

const formPpkRef = ref<FormInstance>();
const formRateRef = ref<FormInstance>();
const formPpk = reactive({ ...initialStatePpk });
const formRate = reactive({ ...initialStateRate });
const loading = ref(false);
const error = ref("");
const feedback = ref({
  title: "",
  message: "",
  type: "",
});

const save = async (formEl: FormInstance | undefined, formData: any, type: string) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    loading.value = true;
    error.value = "";

    if (!valid) {
      loading.value = false;
      return;
    }

    try {
      const { data, message } = await createConfiguration(formData, type);
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

const fetchDataPpk = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data, message } = await getAuthority();
    Object.assign(formPpk, data.value);
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    }
  } finally {
    loading.value = false;
  }
};

const fetchDataRate = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data, message } = await getRate();
    Object.assign(formRate, data.value);
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
  await fetchDataPpk();
  await fetchDataRate();
});
</script>
