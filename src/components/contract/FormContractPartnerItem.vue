<template>
  <el-card shadow="never" style="width: 400px">
    <el-form-item required :prop="getProp('partnerId')" label="Mitra" :rules="{
      required: true,
      message: 'Nama mitra perlu terisi',
      trigger: 'change',
    }">
      <el-select v-model="props.partnerpartnerId" placeholder="Pilih Nama Mitra" clearable filterable>
        <el-option v-for="partner in partners" :key="partner._id" :label="partner.name" :value="partner._id" />
      </el-select>
    </el-form-item>

    <el-form-item required label="Volume" :prop="getProp('volume')" :rules="{
      required: true,
      message: 'Volume perlu terisi',
      trigger: 'blur',
    }">
      <el-input type="number" v-model="props.partnervolume" placeholder="Masukkan Volume" />
    </el-form-item>

    <template #footer>
      <el-button type="danger" @click="$emit('remove')">Hapus Mitra</el-button>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getPartners } from "@/api/partnerApi";

const props: any = defineProps({
  partner: Object,
  index: Number,
});

const partners = ref<any[]>([]);

const getProp = (key: string) => {
  return `partners[${props.index}].${key}`;
};

onMounted(async () => {
  partners.value = await getPartners();
});
</script>
