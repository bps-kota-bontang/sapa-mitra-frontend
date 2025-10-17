<template>
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="auto" label-position="top">
    <el-form-item required label="Kegiatan" prop="activity.activityId">
      <el-select v-model="form.activity.activityId" placeholder="Pilih Nama Kegiatan" clearable filterable>
        <el-option v-for="activity in activities" :key="activity._id" :label="activity.name" :value="activity._id">
          <span style="float: left">{{ activity.name }}</span>
          <span style="
              float: right;
              color: var(--el-text-color-secondary);
              font-size: 13px;
            ">
            {{ activity.code }}
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
        <FormRecapPartnerItem v-for="(partner, index) in form.partners" :key="index" :index="index" :partner="partner"
          :partners="partners" @remove="removePartner(index)" />
      </div>

      <template #footer>
        <div style="gap:10px; display: flex;">
          <el-button @click="syncPartner()">Sinkronisasi Mitra</el-button>
        </div>
      </template>
    </el-card>
    <el-form-item required style="margin-top: 20px">
      <el-button @click="submit(formRef)" type="primary">Simpan</el-button>
      <el-button @click="reset(formRef)">Bersihkan</el-button>
      <el-button @click="downloadRecapByActivity()" type="success">Cetak</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import Papa from "papaparse";
import { ref, reactive, onMounted, watch } from "vue";
import FormRecapPartnerItem from "@/components/recap/FormRecapPartnerItem.vue";
import { createReport } from "@/api/reportApi";
import { ElNotification, type FormInstance, type FormRules, type UploadFile, type UploadFiles, type UploadInstance } from "element-plus";
import { getOutputs } from "@/api/outputApi";
import { generatePeriods } from "@/utils/date";
import { downloadPartners, getPartners } from "@/api/partnerApi";
import { downloadRecapActivity, downloadTemplatePartnerCost, getContractActivityAccount, updateContractActivityRecap } from "@/api/contractApi";
import { useRoute } from "vue-router";
import { getActivities } from "@/api/activityApi";
import Handlebars from "handlebars";
import html2pdf from "html2pdf.js";
import recapTemplate from "@/templates/recap.html?raw";

const route = useRoute();
const currentYear = new Date().getFullYear();
const formRef = ref<FormInstance>();
const fileInput = ref<UploadInstance>();
const rules = reactive<FormRules<any>>({
  "activity.activityId": [
    {
      required: true,
      message: "Nama kegiatan perlu terisi",
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
  "partners": [
    {
      type: 'array',
      required: true,
      message: "Daftar mitra perlu terisi",
      trigger: "change",
    },
  ],
});

const initialState: {
  activity: { activityId: string };
  contract: { period: string };
  partners: { partnerId: string; accountNumber: string }[];
} = {
  activity: {
    activityId: "",
  },
  contract: {
    period: "",
  },
  partners: [],
};

const activities = ref<any[]>([]);
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
  form.partners = [];
};

const downloadMasterPartner = () => {
  const year = route.query.year?.toString() || currentYear.toString();
  downloadPartners(Number(year));
}

const downloadTemplateImportPartner = () => {
  downloadTemplatePartnerCost()
}


const downloadRecapByActivity = async () => {
  try {
    loading.value = true;

    const { data: payload } = await downloadRecapActivity(form);
    if (!payload) {
      ElNotification({
        title: "Error",
        message: "Tidak ada data untuk dicetak",
        type: "error",
      });
      return;
    }

    const template = Handlebars.compile(recapTemplate);
    const compiledHtml = template(payload);

    const options = {
      margin: 20,
      image: { quality: 1 },
      filename: `Rekapitulasi_${payload.activity?.name}_${payload.period?.month} ${payload.period?.year}.pdf`,
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(compiledHtml).save();
  } catch (err: any) {
    console.error(err);
    ElNotification({
      title: "Error",
      message: err.message || "Gagal membuat PDF",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};


const syncPartner = async () => {
  const result = await getContractActivityAccount(form.activity.activityId, form.contract.period);

  const partners = result.map((item: any) => {
    return {
      partnerId: item.partnerId,
      accountNumber: item.accountNumber,
    }
  });

  form.partners = partners;
};

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
      accountNumber: rawPartner.accountNumber,
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
      const { data, message } = await updateContractActivityRecap(form);
      feedback.value = {
        title: "Success",
        message: message,
        type: "success",
      };

      if (formRef.value) {
        formRef.value.resetFields();
        form.partners = [];
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
    accountNumber: "",
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
    partners.value = await getPartners(newYear || currentYear.toString());
    activities.value = await getActivities(newYear || currentYear.toString());
  },
  { immediate: true }
);

</script>
