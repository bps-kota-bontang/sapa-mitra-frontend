<template>
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="auto" label-position="top">
    <el-form-item required label="Mitra" prop="partner.partnerId">
      <el-select v-model="form.partner.partnerId" placeholder="Pilih Nama Mitra" clearable filterable>
        <el-option v-for="partner in partners" :key="partner._id" :label="partner.name" :value="partner._id">
          <span style="float: left">{{ partner.name }}</span>
          <span style="
              float: right;
              color: var(--el-text-color-secondary);
              font-size: 13px;
            ">
            {{ partner.address }}
          </span>
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
          <span>Daftar Output</span>
        </div>
      </template>
      <div style="display: flex; flex-wrap: wrap; gap: 20px">
        <FormReportOutputItem v-for="(output, index) in form.outputs" :key="index" :index="index" :output="output"
          @remove="removeOutput(index)" />
      </div>

      <template #footer><el-button @click="addOutput">Tambah Output</el-button>
      </template>
    </el-card>
    <el-form-item required style="margin-top: 20px">
      <el-button @click="submit(formRef)" type="primary">Buat</el-button>
      <el-button @click="reset(formRef)">Bersikan</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { getPartners } from "@/api/partnerApi";
import { ref, reactive, onMounted, watch } from "vue";
import FormReportOutputItem from "@/components/report/FormReportOutputItem.vue";
import { formatDateOriginal, generatePeriods } from "@/utils/date";
import { createReport } from "@/api/reportApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useRoute } from "vue-router";

const route = useRoute();

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<any>>({
  "partner.partnerId": [
    {
      required: true,
      message: "Nama mitra perlu terisi",
      trigger: "change",
    },
  ],
  "contract.period": [
    {
      required: true,
      message: "Periode SPK perlu terisi",
      trigger: "blur",
    },
  ],
});

const initialState = {
  partner: {
    partnerId: "",
  },
  contract: {
    period: "",
  },
  outputs: [
    {
      outputId: "",
      total: "",
    },
  ],
};

const partners = ref<any[]>([]);
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
      const { data, message } = await createReport(form);
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

const addOutput = () => {
  form.outputs.push({
    outputId: "",
    total: "",
  });
};

const removeOutput = (index: number) => {
  form.outputs.splice(index, 1);
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
  partners.value = await getPartners(route.query.year?.toString());
});

watch(() => route.query.year?.toString(), getPartners, { immediate: true });
</script>
