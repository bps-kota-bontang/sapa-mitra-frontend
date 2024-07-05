<template>
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="auto" label-position="top">
    <el-form-item required label="Output" prop="output.outputId">
      <el-select v-model="form.output.outputId" placeholder="Pilih Nama Output" clearable filterable>
        <el-option v-for="output in outputs" :key="output._id" :label="output.name" :value="output._id">
          <span style="float: left">{{ output.name }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item required label="Periode" prop="contract.period">
      <el-select v-model="form.contract.period" placeholder="Pilih Periode SPK" clearable filterable>
        <el-option v-for="item in periods" :key="item.value" :label="item.text" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>Daftar Mitra</span>
        </div>
      </template>
      <div style="display: flex; flex-wrap: wrap; gap: 20px">
        <FormReportPartnerItem v-for="(partner, index) in form.partners" :key="index" :index="index" :partner="partner"
          @remove="removePartner(index)" />
      </div>

      <template #footer><el-button @click="addPartner">Tambah Mitra</el-button>
      </template>
    </el-card>
    <el-form-item required style="margin-top: 20px">
      <el-button @click="submit(formRef)" type="primary">Buat</el-button>
      <el-button @click="reset(formRef)">Bersihkan</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import FormReportPartnerItem from "@/components/report/FormReportPartnerItem.vue";
import { createReport } from "@/api/reportApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { getOutputs } from "@/api/outputApi";
import { generatePeriods } from "@/utils/date";

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<any>>({
  "output.outputId": [
    {
      required: true,
      message: "Nama output perlu terisi",
      trigger: "change",
    },
  ],
  "contract.period": [
    {
      required: true,
      message: "Periode perlu terisi",
      trigger: "change",
    },
  ],
});

const initialState = {
  output: {
    outputId: "",
  },
  contract: {
    period: "",
  },
  partners: [
    {
      partnerId: "",
      total: "",
    },
  ],
};

const outputs = ref<any[]>([]);

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
      const { data, message } = await createReport(form, "output");
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

const addPartner = () => {
  form.partners.push({
    partnerId: "",
    total: "",
  });
};

const removePartner = (index: number) => {
  form.partners.splice(index, 1);
};

const periods = generatePeriods();

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
  outputs.value = await getOutputs();
});
</script>
