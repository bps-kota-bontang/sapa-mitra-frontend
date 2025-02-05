<template>
  <el-card shadow="never" style="width: 350px">
    <el-form-item required :prop="getProp('outputId')" label="Output" :rules="{
      required: true,
      message: 'Nama Output perlu terisi',
      trigger: 'change',
    }">
      <el-select v-model="props.output.outputId" placeholder="Pilih Nama Output" clearable filterable>
        <el-option v-for="output in props.outputs" :key="output._id" :label="output.name" :value="output._id" >
          <span style="float: left">{{ output.name }}</span>
          <span
            style="
              float: right;
              color: var(--el-text-color-secondary);
              font-size: 13px;
            "
          >
            {{ output.activity.name }}
          </span>
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item required label="Total" :prop="getProp('total')" :rules="{
      required: true,
      message: 'Total perlu terisi',
      trigger: 'blur',
    }">
      <el-input :formatter="formatNumber" :parser="formatParserNumber" v-model="props.output.total"
        placeholder="Masukkan Total" />
    </el-form-item>

    <template #footer>
      <el-button type="danger" @click="$emit('remove')">Hapus Output</el-button>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRefs } from "vue";
import { getOutputs } from "@/api/outputApi";
import { formatNumber, formatParserNumber } from "@/utils/currency";

const props: any = defineProps({
  output: Object,
  index: Number,
  outputs: Object,
});

const getProp = (key: string) => {
  return `outputs[${props.index}].${key}`;
};
</script>
