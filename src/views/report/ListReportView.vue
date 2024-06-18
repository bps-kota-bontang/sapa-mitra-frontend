<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center">
        <span style="margin-right: 20px">Periode</span>
        <el-select
          v-model="periodSelected"
          placeholder="Select"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </div>

      <div style="display: flex; align-items: center">
        <el-button size="large" round @click="print()"
          ><el-icon :size="20" style="margin-right: 8px"><Printer /></el-icon
          >Cetak</el-button
        >
        <el-button type="primary" size="large" round @click="createReport()"
          ><el-icon :size="20" style="margin-right: 8px"><Plus /></el-icon
          >Buat</el-button
        >
      </div>
    </div>

    <el-divider />
    <el-table
      :default-expand-all="expand"
      ref="contractsTableRef"
      v-loading="loading"
      :data="filterReports"
      height="850px"
      row-key="_id"
      style="width: 100%"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" />
      <el-table-column type="expand">
        <template #default="props">
          <div class="container-activity">
            <el-table :data="props.row.outputs" border>
              <el-table-column label="Name" prop="name" />

              <el-table-column label="Satuan" prop="unit" />
              <el-table-column label="Total" prop="total" />

              <el-table-column label="Aksi">
                <template #default="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDeleteOutput(props.row._id, scope.row._id)"
                  >
                    Hapus
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <el-table-column type="index" label="No" />
      <el-table-column label="Nama" sortable prop="partner.name" />
      <el-table-column label="No BAST" prop="number" />
      <el-table-column
        label="Periode"
        sortable
        prop="contract.period"
        :filters="options"
        :filter-method="filterPeriod"
      />
      <el-table-column
        label="Output"
        sortable
        :sort-by="sortOutput"
        :formatter="outputFormatter"
      />

      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            Edit
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >
            Cetak
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteReport(scope.row._id)"
          >
            Hapus
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="clearSelection()">Bersihkan Pilihan</el-button>
      <el-button @click="clearFilter()">Setel Ulang Penyaringan</el-button>
      <el-button @click="expandData()">Tampilkan Rincian</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Printer, Plus } from "@element-plus/icons-vue";
import { getReports, deleteReport, deleteReportOutput } from "@/api/reportApi";
import { formatDate } from "@/utils/date";

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

const filterReports = computed(() => {
  return reports.value.filter(
    (data: any) =>
      !search.value ||
      data.partner.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

// const sortTotal = (row: any, index: number) => {
//   return row.grandTotal;
// };

const sortOutput = (row: any, index: number) => {
  return row.outputs.length;
};

// const sortStatus = (row: any, index: number) => {
//   const totalActivities = row.activities.length;
//   const countVerified = row.activities.filter(
//     (item: any) => item.status === "VERIFIED"
//   ).length;

//   if (countVerified == totalActivities) {
//     return 2;
//   } else if (countVerified == 0) {
//     return 0;
//   } else {
//     return 1;
//   }
// };

// const teams = [
//   {
//     value: "SOSIAL",
//     text: "SOSIAL",
//   },
//   {
//     value: "PRODUKSI",
//     text: "PRODUKSI",
//   },
//   {
//     value: "DISTRIBUSI",
//     text: "DISTRIBUSI",
//   },
//   {
//     value: "NERWILIS",
//     text: "NERWILIS",
//   },
//   {
//     value: "IPDS",
//     text: "IPDS",
//   },
//   {
//     value: "TU",
//     text: "TU",
//   },
// ];

const options = [
  {
    value: "2024-06",
    text: "2024-06",
  },
  {
    value: "2024-05",
    text: "2024-05",
  },
  {
    value: "2024-04",
    text: "2024-04",
  },
  {
    value: "2024-03",
    text: "2024-03",
  },
  {
    value: "2024-02",
    text: "2024-02",
  },
  {
    value: "2024-01",
    text: "2024-01",
  },
];

const handleSelection = (value: any[]) => {
  const reportIdsSelected = value.map((item) => item._id);

  reportsSelected.value = reportIdsSelected;
};

const print = () => {
  console.log(reportsSelected.value);
};

const clearFilter = () => {
  reportsTableRef.value!.clearFilter();
};

const clearSelection = () => {
  reportsTableRef.value!.clearSelection();
};

const expandData = () => {
  reportsTableRef.value.data.forEach((row: any) => {
    reportsTableRef.value!.toggleRowExpansion(row, undefined);
  });
};

const filterPeriod = (value: string, row: any) => {
  return row.contract.period === value;
};

// const filterTeam = (value: string, row: any) => {
//   const teams = row.activities.map((item: any) => item.createdBy);

//   return [...new Set(teams)].includes(value);
// };

// const filterStatus = (value: string, row: any) => {
//   const totalActivities = row.activities.length;
//   const countVerified = row.activities.filter(
//     (item: any) => item.status === "VERIFIED"
//   ).length;

//   let result;

//   if (countVerified == totalActivities) {
//     result = "Lengkap";
//   } else if (countVerified == 0) {
//     result = "Belum";
//   } else {
//     result = "Sebagian";
//   }

//   return result === value;
// };

const createReport = () => {
  router.push({ name: "createReport" });
};

// const statusType = (row: any) => {
//   const totalActivities = row.activities.length;
//   const countVerified = row.activities.filter(
//     (item: any) => item.status === "VERIFIED"
//   ).length;

//   if (countVerified == totalActivities) {
//     return "success";
//   } else if (countVerified == 0) {
//     return "danger";
//   } else {
//     return "warning";
//   }
// };

// const statusText = (row: any) => {
//   const totalActivities = row.activities.length;
//   const countVerified = row.activities.filter(
//     (item: any) => item.status === "VERIFIED"
//   ).length;

//   if (countVerified == totalActivities) {
//     return "Lengkap";
//   } else if (countVerified == 0) {
//     return "Belum";
//   } else {
//     return "Sebagian";
//   }
// };

// const totalFormatter = (row: any) => {
//   return `Rp ${row.grandTotal}`;
// };

// const teamFormatter = (row: any): any[] => {
//   const teams = row.activities.map((item: any) => item.createdBy);

//   return [...new Set(teams)];
// };

const outputFormatter = (row: any) => {
  return `${row.outputs.length} Ouput`;
};

// const dateFormatter = (row: any) => {
//   return `${formatDate(row.startDate)} - ${formatDate(row.endDate)}`;
// };

// const contractStatus = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
//   const totalActivities = row.activities.length;
//   const countVerified = row.activities.filter(
//     (item: any) => item.status === "VERIFIED"
//   ).length;

//   if (countVerified == totalActivities) {
//     return "success-row";
//   } else if (countVerified == 0) {
//     return "danger-row";
//   } else {
//     return "warning-row";
//   }
// };

const executeOperation = async (operation: () => Promise<void>) => {
  try {
    await operation();
    await fetchData(route.query.period, false);
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

const handleEdit = (index: number, row: any) => {
  console.log(index, row);
};

// const isSelecetable = (row: any, index: number) => {
//   const totalActivities = row.activities.length;
//   const countVerified = row.activities.filter(
//     (item: any) => item.status === "VERIFIED"
//   ).length;

//   return countVerified == totalActivities;
// };

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
