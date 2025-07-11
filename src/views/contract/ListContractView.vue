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
        <el-button type="primary" size="large" round @click="createContract()"
          v-if="['ANGGOTA'].includes(user.position) || ['TU'].includes(user.team)"><el-icon :size="20"
            style="margin-right: 8px">
            <Plus />
          </el-icon>Buat</el-button>
      </div>
    </div>

    <el-divider />
    <el-table :default-expand-all="expand" ref="contractsTableRef" v-loading="loading" :row-class-name="contractStatus"
      :data="paginatedData" row-key="_id" style="width: 100%; flex: 1; margin-bottom: 20px;"
      @filter-change="handleFilterChange" @selection-change="handleSelection">
      <el-table-column type="selection" :selectable="isSelecetable" v-if="['TU'].includes(user.team)" />
      <el-table-column type="expand">
        <template #default="props">
          <div class="container-activity">
            <el-table :data="props.row.activities.filter((activity: any) => filterActivities(activity))" border>
              <el-table-column label="Kode" prop="code" />
              <el-table-column label="Name" prop="name" />
              <el-table-column label="Tanggal" :formatter="dateFormatter" />
              <el-table-column label="Volume" prop="volume" />
              <el-table-column label="Rate" prop="rate" :formatter="rateActivityFormatter" />
              <el-table-column label="Total" prop="total" :formatter="totalActivityFormatter" />
              <el-table-column label="Biaya Pelatihan" prop="cost" :formatter="costActivityFormatter" />
              <el-table-column label="Team" prop="createdBy" />
              <el-table-column label="Khusus" prop="isSpecial" :formatter="isSpecialFormatter" />
              <el-table-column label="Status" prop="status" />

              <el-table-column label="Aksi">
                <template #default="scope">
                  <el-button v-if="
                    scope.row.status == 'UNVERIFIED' &&
                    user.position == 'KETUA' &&
                    (user.team == scope.row.createdBy || user.team == 'TU')
                  " size="small" @click="handleEdit(props.row._id, scope.row._id)">
                    Edit
                  </el-button>
                  <el-button v-if="
                    scope.row.status == 'VERIFIED' &&
                    user.position == 'KETUA' &&
                    (user.team == scope.row.createdBy || user.team == 'TU')
                  " size="small" type="warning" @click="handleCancelActivity(props.row._id, scope.row._id)">
                    Batal
                  </el-button>
                  <el-button v-if="
                    scope.row.status == 'UNVERIFIED' &&
                    user.position == 'KETUA' &&
                    (user.team == scope.row.createdBy || user.team == 'TU') &&
                    (!props.row.isExceeded || props.row.hasSpecial) &&
                    ((props.row.hasSpecial && props.row.activities.length == 1) || (!props.row.hasSpecial))
                  " size="small" type="primary" @click="handleVerifyActivity(props.row._id, scope.row._id)">
                    Verifikasi
                  </el-button>
                  <el-button v-if="user.team == scope.row.createdBy || (user.position == 'KETUA' && user.team == 'TU')"
                    size="small" type="danger" @click="handleDeleteActivity(props.row._id, scope.row._id)">
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
      <el-table-column label="No SPK" prop="number" />
      <el-table-column label="Periode" sortable prop="period" column-key="period" :filters="periods"
        :filter-method="filterPeriod" />
      <el-table-column label="Kegiatan" sortable :sort-by="sortActivity" :formatter="activityFormatter"
        column-key="activityIds" :filters="activities" :filter-method="filterActivity" />
      <el-table-column label="Tim" :filters="teams" :filter-method="filterTeam" column-key="team">
        <template #default="scope">
          <el-tag v-if="!teamFormatter(scope.row).includes('-')" style="margin-right: 5px" type="primary"
            v-for="item in teamFormatter(scope.row)" effect="dark" :key="item">{{ item }}</el-tag>
          <el-text v-else>-</el-text>
        </template>
      </el-table-column>

      <el-table-column sortable :sort-by="sortStatus" column-key="status" label="Verifikasi" :filters="[
        { text: 'Lengkap', value: 'Lengkap' },
        { text: 'Sebagian', value: 'Sebagian' },
        { text: 'Belum', value: 'Belum' },
      ]" :filter-method="filterStatus">
        <template #default="scope">
          <el-tag :type="statusType(scope.row)" effect="dark">{{
            statusText(scope.row)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable :sort-by="sortTotal" label="Total" :filters="[
        { text: 'Konsisten', value: false },
        { text: 'Inkonsisten', value: true },
      ]" column-key="total">
        <template #default="scope">
          <el-space direction="vertical">
            <el-text>{{ totalFormatter(scope.row) }}</el-text>
            <el-text v-if="hasErrorTotal(scope.row)" tag="i" type="danger">Inkosisten</el-text>
            <el-text v-if="hasErrorTotal(scope.row)" tag="i" type="danger">{{ totalFormatter(scope.row, true)
              }}</el-text>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column column-key="hasSpecial" label="Khusus" :filters="[
        { text: 'Ada', value: true },
        { text: 'Tidak Ada', value: false },
      ]" :filter-method="filterHasSpecial">
        <template #default="scope">
          <el-tag effect="dark">{{ scope.row.hasSpecial ? 'Ada' : 'Tidak Ada' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable label="Batas" column-key="safe" prop="isExceeded" :filters="[
        { text: 'Aman', value: true },
        { text: 'Tidak Aman', value: false },
      ]" :filter-method="filterSafe">
        <template #default="scope">
          <el-tag
            :type="scope.row.hasSpecial ? (scope.row.activities.length == 1 ? 'success' : 'danger') : (scope.row.isExceeded ? 'danger' : 'success')"
            effect="dark">{{
              scope.row.hasSpecial ? (scope.row.activities.length == 1 ? 'Aman' : 'Tidak Aman') : (scope.row.isExceeded
                ? 'Tidak Aman' : 'Aman')
            }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable label="Batas Atas" prop="limit" :formatter="limitFormatter" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button v-if="
            statusText(scope.row) != 'Lengkap' &&
            user.position == 'KETUA' &&
            user.team == 'TU'
          " size="small" @click="handleEditContract(scope.row._id)">
            Edit
          </el-button>
          <el-button size="small" v-if="['TU'].includes(user.team) && statusText(scope.row) == 'Lengkap'" type="primary"
            @click="handlePrint(scope.$index, scope.row)">
            Cetak
          </el-button>
          <el-button v-if="['TU'].includes(user.team)" size="small" type="danger"
            @click="handleDeleteContract(scope.row._id)">
            Hapus
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;  gap: 20px;">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
        :page-sizes="[10, 25, 50, 100, 500, 1000]" v-model:page-size="pageSize" :current-page="currentPage"
        @current-change="handlePageChange" class="pagination" />
      <div>
        <el-button @click="clearSelection()" v-if="['TU'].includes(user.team)">Bersihkan Pilihan</el-button>
        <el-button @click="clearFilter()">Setel Ulang Penyaringan</el-button>
        <el-button @click="expandData()">Tampilkan Rincian</el-button>
        <el-button @click="downloadSelection()" type="success" v-if="['TU'].includes(user.team)">Unduh Kertas
          Kerja</el-button>
      </div>
    </div>

  </div>
  <DialogFormEditContract @close-dialog="handleCloseDialogFormEdit" :contractId="editedContractId"
    :isShow="showDialogFormContractEdit" />
  <DialogFormEditContractActivity @close-dialog="handleCloseDialogFormEdit" :contractId="editedContractId"
    :activityId="editedActivityId" :isShow="showDialogFormEdit" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Printer, Plus } from "@element-plus/icons-vue";
import {
  getContracts,
  deleteContract,
  verifyContractActivity,
  deleteContractActivity,
  printContracts,
  printContract,
  cancelContractActivity,
  downloadContracts
} from "@/api/contractApi";
import { formatDate, generatePeriods } from "@/utils/date";
import { useUserStore } from "@/stores/user";
import { ElNotification, ElTable } from "element-plus";
import { teams } from "@/utils/constant";
import { formatCurrency } from "@/utils/currency";
import type { Contract } from "@/types/contract";
import { createInitialFilter } from "@/types/filter";

const user = useUserStore();
const router = useRouter();
const route = useRoute();

const initialFilter = createInitialFilter("contract");

const contractsTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const contracts = ref<Contract[]>([]);
const error = ref("");
const contractsSelected = ref<any[]>([]);
const periodSelected = ref(route.query.period);
const expand = ref(false);
const pageSize = ref(10)
const currentPage = ref(1);
const filter = ref(initialFilter);
const total = ref(0);
const editedContractId = ref<string | null>(null);
const editedActivityId = ref<string | null>(null);
const showDialogFormEdit = ref(false);
const showDialogFormContractEdit = ref(false);
const activities = ref<{
  "text": string;
  "value": string;
}[]>([]);

const paginatedData = computed(() => {
  let paginatedData: Contract[] = contracts.value
  if (filter.value.period?.length) {
    paginatedData = paginatedData.filter((item) => {
      return filter.value.period?.includes(item.period)
    });
  }

  if (filter.value.team?.length) {
    paginatedData = paginatedData.filter((item) => {
      return item.activities.some((activity) => {
        return filter.value.team?.includes(activity.createdBy);
      });
    });
  }

  if (filter.value.activityIds?.length) {
    paginatedData = paginatedData.filter((item) => {
      return item.activities.some((activity) => {
        return filter.value.activityIds?.includes(activity._id);
      });
    });
  }

  if (filter.value.status?.length) {
    paginatedData = paginatedData.filter((item) => {
      const totalActivities = item.activities.length;
      const countVerified = item.activities.filter(
        (item: any) => item.status === "VERIFIED"
      ).length;

      let result;

      if (totalActivities == 0) {
        result = "Belum";
      } else if (countVerified == totalActivities) {
        result = "Lengkap";
      } else if (countVerified == 0) {
        result = "Belum";
      } else {
        result = "Sebagian";
      }

      return filter.value.status?.includes(result);
    });
  }

  if (filter.value.total?.length) {

    paginatedData = paginatedData.filter((item) => {

      const grandTotal = item.activities.reduce(
        (total: number, activity: any) => total + activity.total,
        0
      );

      const hasError = grandTotal != item.grandTotal;

      return filter.value.total?.includes(hasError)
    });
  }

  if (filter.value.safe?.length) {

    paginatedData = paginatedData.filter((item) => {
      const isSafe = item.hasSpecial ? (item.activities.length == 1 ? true : false) : (item.isExceeded ? false : true);

      return filter.value.safe?.includes(isSafe)
    });
  }

  if (filter.value.hasSpecial?.length) {

    paginatedData = paginatedData.filter((item) => {

      return filter.value.hasSpecial?.includes(item.hasSpecial)
    });
  }

  if (search.value) {
    paginatedData = paginatedData.filter(
      (data: any) =>
        !search.value ||
        data.partner.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  total.value = paginatedData.length
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;

  return paginatedData.slice(start, end);
});

const filterActivities = (activity: any) => {
  const matchActivity = !filter.value.activityIds || filter.value.activityIds.includes(activity._id);

  return matchActivity;
};

const handleFilterChange = (newFilters: any) => {
  if (newFilters.period) {
    filter.value.period = newFilters.period
  }

  if (newFilters.team) {
    filter.value.team = newFilters.team
  }

  if (newFilters.status) {
    filter.value.status = newFilters.status
  }

  if (newFilters.total) {
    filter.value.total = newFilters.total
  }

  if (newFilters.safe) {
    filter.value.safe = newFilters.safe
  }

  if (newFilters.hasSpecial) {
    filter.value.hasSpecial = newFilters.hasSpecial
  }

  if (newFilters.activityIds) {
    filter.value.activityIds = newFilters.activityIds
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const sortTotal = (row: any, index: number) => {
  return row.grandTotal;
};

const sortActivity = (row: any, index: number) => {
  return row.activities.length;
};

const sortStatus = (row: any, index: number) => {
  const totalActivities = row.activities.length;
  const countVerified = row.activities.filter(
    (item: any) => item.status === "VERIFIED"
  ).length;

  if (totalActivities == 0) {
    return 0;
  } else if (countVerified == totalActivities) {
    return 2;
  } else if (countVerified == 0) {
    return 0;
  } else {
    return 1;
  }
};

const periods = generatePeriods();

const handleSelection = (value: any[]) => {
  const contractIdsSelected = value.map((item) => item._id);

  contractsSelected.value = contractIdsSelected;
};

const downloadSelection = () => {
  executeOperation(() => downloadContracts(contractsSelected.value));
};

const print = () => {
  executeOperation(() => printContracts(contractsSelected.value), false);
};

const handleEditContract = (id: string) => {
  editedContractId.value = id;
  showDialogFormContractEdit.value = true;
}

const clearFilter = () => {
  contractsTableRef.value!.clearFilter();
  search.value = ""
  periodSelected.value = null;
  filter.value = {
    activityIds: [],
    team: [],
    period: [],
    status: [],
    safe: [],
    total: []
  }
};

const clearSelection = () => {
  contractsTableRef.value!.clearSelection();
};

const expandData = () => {
  if (contractsTableRef.value) {
    contractsTableRef.value.data.forEach((row: any) => {
      contractsTableRef.value!.toggleRowExpansion(row, undefined);
    });
  }

};

const filterPeriod = (value: string, row: any) => {
  return row.period === value;
};

const filterActivity = (value: string, row: any) => {
  const activities = row.activities.map((item: any) => item._id);

  return [...new Set(activities)].includes(value);
};

const filterTeam = (value: string, row: any) => {
  const teams = row.activities.map((item: any) => item.createdBy);

  return [...new Set(teams)].includes(value);
};

const filterSafe = (value: boolean, row: any) => {
  const isSafe = row.hasSpecial ? (row.activities.length == 1 ? true : false) : (row.isExceeded ? false : true);

  return isSafe === value;
};

const filterHasSpecial = (value: boolean, row: any) => {
  return row.hasSpecial === value;
};

const filterStatus = (value: string, row: any) => {
  const totalActivities = row.activities.length;
  const countVerified = row.activities.filter(
    (item: any) => item.status === "VERIFIED"
  ).length;

  let result;

  if (totalActivities == 0) {
    result = "Belum";
  } else if (countVerified == totalActivities) {
    result = "Lengkap";
  } else if (countVerified == 0) {
    result = "Belum";
  } else {
    result = "Sebagian";
  }

  return result === value;
};

const createContract = () => {
  router.push({ name: "createContract" });
};

const handleCloseDialogFormEdit = async (refetch: boolean = false) => {
  editedContractId.value = null;
  editedActivityId.value = null;
  showDialogFormEdit.value = false;
  showDialogFormContractEdit.value = false;
  if (refetch) await fetchData(route.query.period, false);
};

const handleEdit = (id: string, activityId: string) => {
  editedContractId.value = id;
  editedActivityId.value = activityId;
  showDialogFormEdit.value = true;
};

const statusType = (row: any) => {
  const totalActivities = row.activities.length;
  const countVerified = row.activities.filter(
    (item: any) => item.status === "VERIFIED"
  ).length;

  if (totalActivities == 0) {
    return "danger";
  } else if (countVerified == totalActivities) {
    return "success";
  } else if (countVerified == 0) {
    return "danger";
  } else {
    return "warning";
  }
};

const statusText = (row: any) => {
  const totalActivities = row.activities.length;
  const countVerified = row.activities.filter(
    (item: any) => item.status === "VERIFIED"
  ).length;

  if (totalActivities == 0) {
    return "Belum";
  } else if (countVerified == totalActivities) {
    return "Lengkap";
  } else if (countVerified == 0) {
    return "Belum";
  } else {
    return "Sebagian";
  }
};

const rateActivityFormatter = (row: any) => {
  return `Rp ${formatCurrency(row.rate)}`;
};

const totalActivityFormatter = (row: any) => {
  return `Rp ${formatCurrency(row.total)}`;
};

const costActivityFormatter = (row: any) => {
  return `Rp ${formatCurrency(row.cost)}`;
};

const limitFormatter = (row: any) => {
  return `Rp ${formatCurrency(row.limit)}`;
};

const totalFormatter = (row: any, raw: boolean = false) => {
  let total = row.grandTotal;
  if (raw) {
    total = row.activities.reduce(
      (total: number, activity: any) => total + activity.total,
      0
    );
  }

  return `Rp ${formatCurrency(total)}`;
};

const hasErrorTotal = (row: any) => {
  const grandTotal = row.activities.reduce(
    (total: number, activity: any) => total + activity.total,
    0
  );

  return grandTotal != row.grandTotal;
}

const teamFormatter = (row: any): any[] => {
  const teams = row.activities.map((item: any) => item.createdBy);

  if (teams.length == 0) {
    return [...new Set(["-"])];
  }

  return [...new Set(teams)];
};

const activityFormatter = (row: any) => {
  return `${row.activities.length} Kegiatan`;
};

const dateFormatter = (row: any) => {
  return `${formatDate(row.startDate)} - ${formatDate(row.endDate)}`;
};

const isSpecialFormatter = (row: any) => {
  return row.isSpecial ? "Ya" : "Tidak";
};

const contractStatus = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  const totalActivities = row.activities.length;
  const countVerified = row.activities.filter(
    (item: any) => item.status === "VERIFIED"
  ).length;

  if (totalActivities == 0) {
    return "danger-row";
  } else if (countVerified == totalActivities) {
    return "success-row";
  } else if (countVerified == 0) {
    return "danger-row";
  } else {
    return "warning-row";
  }
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

const handleCancelActivity = async (id: string, activityId: string) => {
  executeOperation(() => cancelContractActivity(id, activityId));
};

const handleVerifyActivity = async (id: string, activityId: string) => {
  executeOperation(() => verifyContractActivity(id, activityId));
};

const handleDeleteActivity = (id: string, activityId: string) => {
  executeOperation(() => deleteContractActivity(id, activityId));
};

const handleDeleteContract = (id: string) => {
  executeOperation(() => deleteContract(id));
};

const handlePrint = (index: number, row: any) => {
  executeOperation(() => printContract(row._id, row.number, row.partner.name), false);
};

const isSelecetable = (row: any, index: number) => {
  const totalActivities = row.activities.length;
  const countVerified = row.activities.filter(
    (item: any) => item.status === "VERIFIED"
  ).length;

  return countVerified == totalActivities;
};

const fetchData = async (period: any, showLoading: boolean = true) => {
  if (period == undefined) {
    periodSelected.value = null;
  }

  if (showLoading) {
    loading.value = true;
    contracts.value = [];
    activities.value = [];
    error.value = "";
  }

  try {
    const data = await getContracts(period);
    contracts.value = data;
    const uniqueActivities = new Map<string, { text: string; value: string }>();

    data.forEach((contract: Contract) => {
      contract.activities.forEach((activity: any) => {
        uniqueActivities.set(activity._id, { text: activity.name, value: activity._id });
      });
    });

    activities.value = Array.from(uniqueActivities.values());


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
    router.push({ name: "listContract", query });
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
