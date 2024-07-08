<template>
  <el-card shadow="never" style="width: 350px">
    <el-form-item required :prop="getProp('partnerId')" label="Mitra" :rules="{
      required: true,
      message: 'Nama mitra perlu terisi',
      trigger: 'change',
    }">
      <el-select v-model="props.partner.partnerId" placeholder="Pilih Nama Mitra" clearable filterable>
        <el-option v-for="partner in props.partners" :key="partner._id" :label="partner.name" :value="partner._id" />
      </el-select>
    </el-form-item>

    <el-form-item required label="Volume" :prop="getProp('volume')" :rules="{
      required: true,
      message: 'Volume perlu terisi',
      trigger: 'blur',
    }">
      <el-input v-model="props.partner.volume" placeholder="Masukkan Volume" :formatter="formatNumber"
        :parser="formatParserNumber" />
    </el-form-item>

    <template #footer>
      <el-button type="danger" @click="$emit('remove')">Hapus Mitra</el-button>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { formatNumber, formatParserNumber } from "@/utils/currency";

const props: any = defineProps({
  partner: Object,
  index: Number,
  partners: Object
});

const getProp = (key: string) => {
  return `partners[${props.index}].${key}`;
};

</script>
