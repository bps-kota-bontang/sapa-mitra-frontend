<template>
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="auto" label-position="top">
    <el-form-item required prop="activity.activityId" label="Nama Kegiatan">
      <el-select v-model="form.activity.activityId" placeholder="Pilih Nama Kegiatan" clearable filterable>
        <el-option v-for="activity in activities" :key="activity._id" :label="activity.name" :value="activity._id" />
      </el-select>
    </el-form-item>
    <el-form-item required label="Nama" prop="name">
      <el-input v-model="form.name" placeholder="Masukkan Nama Output" />
    </el-form-item>
    <el-form-item required label="Satuan" prop="unit">
      <el-input v-model="form.unit" placeholder="Masukkan Satuan Output" />
    </el-form-item>
    <el-form-item required label="Tahun" prop="year">
      <el-input v-model="form.year" placeholder="Masukkan Tahun Output"  />
    </el-form-item>

    <el-form-item required style="margin-top: 20px">
      <el-button @click="submit(formRef)" type="primary">Tambah</el-button>
      <el-button @click="reset(formRef)">Bersihkan</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from "vue";
import { createOutput } from "@/api/outputApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { getActivities } from "@/api/activityApi";

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<any>>({
  "activity.activityId": [
    {
      required: true,
      message: 'Nama kegiatan perlu terisi',
      trigger: 'change',
    }
  ],
  name: [
    {
      required: true,
      message: "Nama output perlu terisi",
      trigger: "blur",
    },
  ],
  unit: [
    {
      required: true,
      message: "Satuan output perlu terisi",
      trigger: "blur",
    },
  ],
  year: [
    {
      required: true,
      message: "Tahun output perlu terisi",
      trigger: "blur",
    },
  ],
});

const initialState = {
  activity: {
    activityId: "",
  },
  name: "",
  unit: "",
  year: "",
};

let feedback = ref({
  title: "",
  message: "",
  type: "",
});
const loading = ref(false);
const form = reactive({ ...initialState });
const activities = ref<any[]>([]);
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
      const { data, message } = await createOutput(form);
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
onMounted(async () => {
  activities.value = await getActivities();
});
</script>
