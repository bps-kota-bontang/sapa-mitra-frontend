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

    <el-form-item required label="Tanggal Mulai" prop="activity.startDate">
      <el-col>
        <el-date-picker v-model="form.activity.startDate" type="date" placeholder="Pilih Tanggal Mulai" />
      </el-col>
    </el-form-item>
    <el-form-item required label="Tanggal Selesai" prop="activity.endDate">
      <el-col>
        <el-date-picker v-model="form.activity.endDate" type="date" placeholder="Pilih Tanggal Selesai" />
      </el-col>
    </el-form-item>

    <el-form-item required label="Rate" prop="activity.rate">
      <el-input type="number" v-model="form.activity.rate" placeholder="Masukkan Rate" />
    </el-form-item>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>Daftar Mitra</span>
        </div>
      </template>
      <div style="display: flex; flex-wrap: wrap; gap: 20px">
        <FormContractPartnerItem v-for="(partner, index) in form.partners" :key="index" :index="index"
          :partner="partner" @remove="removePartner(index)" />
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
import FormContractPartnerItem from "@/components/contract/FormContractPartnerItem.vue";
import { formatDateOriginal, generatePeriods } from "@/utils/date";
import { createContract } from "@/api/contractApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { getActivities } from "@/api/activityApi";

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<any>>({
  "activity.activityId": [
    {
      required: true,
      message: "Nama kegiatan perlu terisi",
      trigger: "change",
    },
  ],
  "activity.startDate": [
    {
      required: true,
      message: "Tanggal mulai perlu terisi",
      trigger: "change",
    },
  ],
  "activity.endDate": [
    {
      required: true,
      message: "Tanggal selesai perlu terisi",
      trigger: "change",
    },
  ],
  "activity.rate": [
    {
      required: true,
      message: "Rate perlu terisi",
      trigger: "blur",
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
  activity: {
    activityId: "",
    startDate: "",
    endDate: "",
    rate: "",
  },
  contract: {
    period: "",
  },
  partners: [
    {
      partnerId: "",
      volume: "",
    },
  ],
};

const activities = ref<any[]>([]);

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

    const modifiedActivity = {
      ...form.activity,
      startDate: formatDateOriginal(form.activity.startDate),
      endDate: formatDateOriginal(form.activity.endDate),
    };

    const payload = {
      ...form,
      activity: modifiedActivity,
    };

    try {
      const { data, message } = await createContract(payload, "activity");

      await showNotification("Success", message, "success");

      for await (const contract of data) {
        if (contract.isExceeded) {
          ElNotification({
            title: "Warning",
            message: `${contract.partner.name}'s contract in the ${contract.period} period exceeded the limit`,
            type: "warning",
            duration: 0,
          });
        }
      }

      if (formRef.value) {
        formRef.value.resetFields();
      }
    } catch (e) {
      if (e instanceof Error) {
        await showNotification("Error", e.message, "error");
      }
    } finally {
      loading.value = false;
    }
  });
};

const addPartner = () => {
  form.partners.push({
    partnerId: "",
    volume: "",
  });
};

const removePartner = (index: number) => {
  form.partners.splice(index, 1);
};

const periods = generatePeriods();

const showNotification = async (title: string, message: string, type: string) => {
  ElNotification({
    title: title,
    message: message,
    type: type,
  } as any);
}

onMounted(async () => {
  activities.value = await getActivities();
});
</script>
