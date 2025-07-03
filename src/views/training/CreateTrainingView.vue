<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center; gap:20px">
        <span>Tahun</span>
        <el-select v-model="yearSelected" placeholder="Select" clearable style="width: 240px"
          @change="handleYearChange">
          <el-option v-for="item in years" :key="item.value" :label="item.text" :value="item.value" />
        </el-select>
      </div>


    </div>
    <el-divider />
    <el-tabs type="border-card">
      <!-- <el-tab-pane lazy label="Satu Mitra Banyak Output">
        <FormReportByPartner />
      </el-tab-pane> -->
      <el-tab-pane lazy label="Satu Output Banyak Mitra">
        <FormTrainingByActivity />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FormTrainingByActivity from "@/components/training/FormTrainingByActivity.vue";
import { useRoute, useRouter } from "vue-router";
import { generateYear } from "@/utils/date";

const route = useRoute();
const router = useRouter();
const currentYear = new Date().getFullYear();
const years = generateYear();

const yearSelected = ref(route.query.year || currentYear.toString());

const handleYearChange = (value: string) => {
  const query: any = {};
  if (value) {
    query.year = value;
  }
  router.push({ name: "createReport", query });
};
</script>
