<template>
  <el-card shadow="never" style="width: 350px">
    <el-form-item required :prop="getProp('activityId')" label="Kegiatan" :rules="{
      required: true,
      message: 'Nama kegiatan perlu terisi',
      trigger: 'change',
    }">
      <el-select v-model="props.activity.activityId" placeholder="Pilih Nama Kegiatan" clearable filterable>
        <el-option v-for="activity in activities" :key="activity._id" :label="activity.name" :value="activity._id" />
      </el-select>
    </el-form-item>
    <el-form-item required label="Tanggal Mulai" :prop="getProp('startDate')" :rules="{
      required: true,
      message: 'Tanggal mulai perlu terisi',
      trigger: 'change',
    }">
      <el-col>
        <el-date-picker v-model="props.activity.startDate" type="date" placeholder="Pilih Tanggal Mulai" />
      </el-col>
    </el-form-item>
    <el-form-item required label="Tanggal Selesai" :prop="getProp('endDate')" :rules="{
      required: true,
      message: 'Tanggal selesai perlu terisi',
      trigger: 'change',
    }">
      <el-col>
        <el-date-picker v-model="props.activity.endDate" type="date" placeholder="Pilih Tanggal Selesai" />
      </el-col>
    </el-form-item>
    <el-form-item required label="Volume" :prop="getProp('volume')" :rules="{
      required: true,
      message: 'Volume perlu terisi',
      trigger: 'blur',
    }">
      <el-input type="number" v-model="props.activity.volume" placeholder="Masukkan Volume" />
    </el-form-item>
    <el-form-item required label="Rate" :prop="getProp('rate')" :rules="{
      required: true,
      message: 'Rate perlu terisi',
      trigger: 'blur',
    }">
      <el-input type="number" v-model="props.activity.rate" placeholder="Masukkan Rate" />
    </el-form-item>
    <template #footer>
      <el-button type="danger" @click="$emit('remove')">Hapus Kegiatan</el-button>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getActivities } from "@/api/activityApi";

const props: any = defineProps({
  activity: Object,
  index: Number,
});

const activities = ref<any[]>([]);

const getProp = (key: string) => {
  return `activities[${props.index}].${key}`;
};

onMounted(async () => {
  const data = await getActivities();
  activities.value = data;
});
</script>
