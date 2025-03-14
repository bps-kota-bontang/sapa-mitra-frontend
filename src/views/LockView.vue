<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <el-table ref="statusesTableRef" v-loading="loading" :data="paginatedData" row-key="_id"
      style="width: 100%; flex: 1; margin-bottom: 20px;">
      <el-table-column prop="index" width="50" label="No" />
      <el-table-column label="Periode" sortable prop="period" />
      <el-table-column label="SPK" sortable prop="contract">
        <template #default="scope">
          <el-switch v-model="scope.row.contract" active-color="#13ce66" inactive-color="#ff4949"
            @change="handleUpdateStatusContract(scope.row.period, scope.row.contract)" />
        </template>
      </el-table-column>
      <el-table-column label="BAST" prop="output">
        <template #default="scope">
          <el-switch v-model="scope.row.output" active-color="#13ce66" inactive-color="#ff4949"
            @change="handleUpdateStatusOutput(scope.row.period, scope.row.output)" />
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;  gap: 20px;">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total"
        :page-sizes="[10, 25, 50, 100, 500, 1000]" v-model:page-size="pageSize" :current-page="currentPage"
        @current-change="handlePageChange" class="pagination" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { ElNotification, ElTable } from "element-plus";

import { getStatuses, updateStatusContract, updateStatusOutput } from "@/api/statusApi";
import type { Status } from "@/types/status";
import { generatePeriods } from "@/utils/date";

const statusesTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const statuses = ref<Status[]>([]);
const error = ref("");
const pageSize = ref(10)
const currentPage = ref(1);
const total = computed(() => filterOutputs.value.length);

const periods = generatePeriods();

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filterOutputs.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const filterOutputs = computed(() => {
  return statuses.value.filter(
    (data: any) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const executeOperation = async (operation: () => Promise<void>) => {
  try {
    await operation();
    await fetchData();
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    }
  }
};

const handleUpdateStatusContract = (period: string, islocked: boolean) => {
  executeOperation(() => updateStatusContract(period, islocked));
};

const handleUpdateStatusOutput = (period: string, islocked: boolean) => {
  executeOperation(() => updateStatusOutput(period, islocked));
};

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const data = await getStatuses(); // Ambil data dari API
    statuses.value = periods.map(({ value }, index) => {
      const existingStatus = data.find((s: any) => s.period === value);
      return existingStatus ?? { period: value, contract: false, output: false, index: index + 1 };
    });

  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    }
  } finally {
    loading.value = false;
  }
};

watch(
  () => error.value,
  (error: any) => {
    if (error != "") {
      ElNotification({
        title: "Error",
        message: error,
        type: "error",
      });
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchData();
});
</script>

<style>
.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.container-output {
  margin: 10px;
}
</style>
