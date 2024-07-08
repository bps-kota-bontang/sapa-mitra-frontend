<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center; gap:20px">
        <span>Periode</span>
        <el-select v-model="periodSelected" placeholder="Select" clearable style="width: 240px">
          <el-option v-for="item in periods" :key="item.value" :label="item.text" :value="item.value" />
        </el-select>
        <el-button @click="fetchData(route.query.period)">Muat Ulang</el-button>
      </div>

      <div style="display: flex; align-items: center">
        <el-button size="large" round @click="print()" v-if="['TU'].includes(user.team)"><el-icon :size="20"
            style="margin-right: 8px">
            <Printer />
          </el-icon>Cetak</el-button>
        <el-button v-if="!['KEPALA'].includes(user.position)" type="primary" size="large" round
          @click="createReport()"><el-icon :size="20" style="margin-right: 8px">
            <Plus />
          </el-icon>Buat</el-button>
      </div>
    </div>

    <el-divider />
    <el-table :default-expand-all="expand" ref="reportsTableRef" v-loading="loading" :data="paginatedData" row-key="_id"
      style="width: 100%; flex: 1; margin-bottom: 20px;" @selection-change="handleSelection">
      <el-table-column type="selection" v-if="['TU'].includes(user.team)" />
      <el-table-column type="expand">
        <template #default="props">
          <div class="container-activity">
            <el-table :data="props.row.outputs" border>
              <el-table-column label="Name" prop="name" />

              <el-table-column label="Satuan" prop="unit" />
              <el-table-column label="Total" prop="total" />

              <el-table-column label="Aksi">
                <template #default="scope">
                  <el-button size="small" type="danger" @click="handleDeleteOutput(props.row._id, scope.row._id)">
                    Hapus
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="index" width="50" label="No" />
      <el-table-column label="Nama" sortable prop="partner.name" />
      <el-table-column label="No BAST" prop="number" />
      <el-table-column label="Periode" sortable prop="contract.period" :filters="periods"
        :filter-method="filterPeriod" />
      <el-table-column label="Output" sortable :sort-by="sortOutput" :formatter="outputFormatter" />

      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" v-if="['TU'].includes(user.team)" type="primary"
            @click="handlePrint(scope.$index, scope.row)">
            Cetak
          </el-button>
          <el-button v-if="['TU'].includes(user.team)" size="small" type="danger"
            @click="handleDeleteReport(scope.row._id)">
            Hapus
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex;  gap: 20px;">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
        :page-sizes="[10, 25, 50, 100]" v-model:page-size="pageSize" :current-page="currentPage"
        @current-change="handlePageChange" class="pagination" />
      <div>
        <el-button @click="clearSelection()" v-if="['TU'].includes(user.team)">Bersihkan Pilihan</el-button>
        <el-button @click="clearFilter()">Setel Ulang Penyaringan</el-button>
        <el-button @click="expandData()">Tampilkan Rincian</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Printer, Plus } from "@element-plus/icons-vue";
import { getReports, deleteReport, deleteReportOutput, printReports, printReport } from "@/api/reportApi";
import { useUserStore } from "@/stores/user";
import { ElNotification, type ElTable } from "element-plus";
import { generatePeriods } from "@/utils/date";

const user = useUserStore();
const router = useRouter();
const route = useRoute();

const reportsTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const reports = ref<any[]>([]);
const error = ref("");
const reportsSelected = ref<any[]>([]);
const periodSelected = ref(route.query.period);
const expand = ref(false);
const pageSize = ref(10)
const currentPage = ref(1);

const total = computed(() => filterReports.value.length);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filterReports.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const filterReports = computed(() => {
  return reports.value.filter(
    (data: any) =>
      !search.value ||
      data.partner.name.toLowerCase().includes(search.value.toLowerCase())
  );
});


const sortOutput = (row: any, index: number) => {
  return row.outputs.length;
};

const periods = generatePeriods();

const handleSelection = (value: any[]) => {
  const reportIdsSelected = value.map((item) => item._id);

  reportsSelected.value = reportIdsSelected;
};

const print = () => {
  executeOperation(() => printReports(reportsSelected.value), false);
};

const clearFilter = () => {
  reportsTableRef.value!.clearFilter();
  search.value = ""
  periodSelected.value = null;
};

const clearSelection = () => {
  reportsTableRef.value!.clearSelection();
};

const expandData = () => {
  if (reportsTableRef.value) {
    reportsTableRef.value.data.forEach((row: any) => {
      reportsTableRef.value!.toggleRowExpansion(row, undefined);
    });
  }

};

const filterPeriod = (value: string, row: any) => {
  return row.contract.period === value;
};

const createReport = () => {
  router.push({ name: "createReport" });
};

const outputFormatter = (row: any) => {
  return `${row.outputs.length} Output`;
};

const executeOperation = async (operation: () => Promise<void>, refetch: boolean = true) => {
  try {
    await operation();
    if (refetch) await fetchData(route.query.period, false);
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    }
  }
};

const handleDeleteOutput = (id: string, outputId: string) => {
  executeOperation(() => deleteReportOutput(id, outputId));
};

const handleDeleteReport = (id: string) => {
  executeOperation(() => deleteReport(id));
};

const handlePrint = (index: number, row: any) => {
  executeOperation(() => printReport(row._id, row.number, row.partner.name), false);
};

const fetchData = async (period: any, showLoading: boolean = true) => {
  if (period == undefined) {
    periodSelected.value = null;
  }

  if (showLoading) {
    loading.value = true;
    reports.value = [];
    error.value = "";
  }

  try {
    reports.value = await getReports(period);
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    }
  } finally {
    if (showLoading) {
      loading.value = false;
    }
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

watch(() => route.query.period, fetchData, { immediate: true });

watch(
  () => periodSelected.value,
  (periodSelected: any) => {
    const query: any = {};
    if (periodSelected) {
      query.period = periodSelected;
    }
    router.push({ name: "listReport", query });
  },
  { immediate: true }
);
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

.container-activity {
  margin: 10px;
}
</style>
