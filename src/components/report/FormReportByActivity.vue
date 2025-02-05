<template>
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="auto" label-position="top">
    <el-form-item required label="Output" prop="output.outputId">
      <el-select v-model="form.output.outputId" placeholder="Pilih Nama Output" clearable filterable>
        <el-option v-for="output in outputs" :key="output._id" :label="output.name" :value="output._id">
          <span style="float: left">{{ output.name }}</span>
          <span style="
              float: right;
              color: var(--el-text-color-secondary);
              font-size: 13px;
            ">
            {{ output.activity.name }}
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
          <span>Daftar Mitra</span>
        </div>
      </template>
      <div style="display: flex; flex-wrap: wrap; gap: 20px">
        <FormReportPartnerItem v-for="(partner, index) in form.partners" :key="index" :index="index" :partner="partner"
          :partners="partners" @remove="removePartner(index)" />
      </div>

      <template #footer>
        <div style="gap:10px; display: flex;">
          <el-button type="primary" @click="addPartner">Tambah Mitra</el-button>
          <el-upload ref="fileInput" :limit="1" :show-file-list="false" action="#" accept="text/csv"
            :auto-upload="false" :on-change="handleFileChange">
            <el-button>
              Impor Mitra
            </el-button>
          </el-upload>
          <el-button type="success" @click="downloadMasterPartner()">Unduh Master Data Mitra</el-button>
          <el-button @click="downloadTemplateImportPartner()">Template Impor Mitra</el-button>
          <el-button @click="syncPartner()">Sinkronisasi Mitra</el-button>
        </div>
      </template>
    </el-card>
    <el-form-item required style="margin-top: 20px">
      <el-button @click="submit(formRef)" type="primary">Buat</el-button>
      <el-button @click="reset(formRef)">Bersihkan</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import Papa from "papaparse";
import { ref, reactive, onMounted, watch } from "vue";
import FormReportPartnerItem from "@/components/report/FormReportPartnerItem.vue";
import { createReport } from "@/api/reportApi";
import { ElNotification, type FormInstance, type FormRules, type UploadFile, type UploadFiles, type UploadInstance } from "element-plus";
import { getOutputs } from "@/api/outputApi";
import { generatePeriods } from "@/utils/date";
import { downloadPartners, getPartners } from "@/api/partnerApi";
import { downloadTemplatePartner } from "@/api/reportApi";
import { getContractActivityVolume } from "@/api/contractApi";
import { useRoute } from "vue-router";

const route = useRoute();
const currentYear = new Date().getFullYear();
const formRef = ref<FormInstance>();
const fileInput = ref<UploadInstance>();
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

const downloadMasterPartner = () => {
  downloadPartners()
}

const downloadTemplateImportPartner = () => {
  downloadTemplatePartner()
}

const syncPartner = async () => {
  const result = await getContractActivityVolume(form.output.outputId, form.contract.period)

  result.forEach((rawPartner: any) => {
    form.partners.push({
      partnerId: rawPartner.partnerId,
      total: rawPartner.volume,
    });
  });
}

const handleFileChange = async (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  const raw = await uploadFile.raw?.text();

  if (!raw) return

  var result = Papa.parse(raw, {
    header: true
  });

  result.data.forEach((rawPartner: any) => {
    const partner = partners.value.find(item => item.nik == rawPartner.nik);

    if (!partner) return

    form.partners.push({
      partnerId: partner._id,
      total: rawPartner.total,
    });
  });

  fileInput.value?.clearFiles()
}

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

// onMounted(async () => {
//   outputs.value = await getOutputs(route.query.year?.toString());
//   partners.value = await getPartners(route.query.year?.toString());
// });

watch(
  () => route.query.year?.toString(),
  async (newYear) => {
    outputs.value = await getOutputs(newYear || currentYear.toString());
    partners.value = await getPartners(newYear || currentYear.toString());
  },
  { immediate: true }
);

</script>
