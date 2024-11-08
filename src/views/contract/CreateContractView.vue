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
      <el-tab-pane lazy label="Satu Mitra Banyak Kegiatan">
        <FormContractByPartner />
      </el-tab-pane>
      <el-tab-pane lazy label="Satu Kegiatan Banyak Mitra">
        <FormContractByActivity />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FormContractByPartner from "@/components/contract/FormContractByPartner.vue";
import FormContractByActivity from "@/components/contract/FormContractByActivity.vue";
import { useRoute, useRouter } from "vue-router";
import { generateYear } from "@/utils/date";

const route = useRoute();
const router = useRouter();

const years = generateYear();

const yearSelected = ref(route.query.year);

const handleYearChange = (value: string) => {
  const query: any = {};
  if (value) {
    query.year = value;
  }
  router.push({ name: "createContract", query });
};
</script>
