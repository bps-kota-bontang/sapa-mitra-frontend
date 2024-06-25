<template>
  <el-card shadow="never" style="width: 400px">
    <el-form-item
      required
      :prop="getProp('outputId')"
      label="Ouput"
      :rules="{
        required: true,
        message: 'Nama Output perlu terisi',
        trigger: 'change',
      }"
    >
      <el-select
        v-model="output.outputId"
        placeholder="Pilih Nama Output"
        clearable
        filterable
      >
        <el-option
          v-for="output in outputs"
          :key="output._id"
          :label="output.name"
          :value="output._id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      required
      label="Total"
      :prop="getProp('total')"
      :rules="{
        required: true,
        message: 'Total perlu terisi',
        trigger: 'blur',
      }"
    >
      <el-input
        type="number"
        v-model="output.total"
        placeholder="Masukkan Total"
      />
    </el-form-item>

    <template #footer>
      <el-button type="danger" @click="$emit('remove')">Hapus Output</el-button>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRefs } from "vue";
import { getOutputs } from "@/api/outputApi";

defineProps({
  output: Object,
  index: Number,
});

const outputs = ref<any[]>([]);

const getProp = (key: string) => {
  return `outputs[${index}].${key}`;
};

onMounted(async () => {
  outputs.value = await getOutputs();
});
</script>
