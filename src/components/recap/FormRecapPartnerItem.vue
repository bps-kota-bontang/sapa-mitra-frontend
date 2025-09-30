<template>
  <el-card shadow="never" style="width: 350px">
    <el-form-item required :prop="getProp('partnerId')" label="Mitra" :rules="{
      required: true,
      message: 'Nama mitra perlu terisi',
      trigger: 'change',
    }">
      <el-select v-model="props.partner.partnerId" placeholder="Pilih Nama Mitra" clearable filterable disabled>
        <el-option v-for="partner in props.partners" :key="partner._id" :label="partner.name" :value="partner._id">
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

    <el-form-item required label="Nomor Rekening" :prop="getProp('accountNumber')" :rules="{
      required: true,
      message: 'Nomor Rekening perlu terisi',
      trigger: 'blur',
    }">
      <el-input v-model="props.partner.accountNumber" placeholder="Masukkan Nomor Rekening" />
    </el-form-item>
  </el-card>
</template>

<script lang="ts" setup>

const props: any = defineProps({
  partner: Object,
  index: Number,
  partners: Object,
});

const getProp = (key: string) => {
  return `partners[${props.index}].${key}`;
};
</script>
