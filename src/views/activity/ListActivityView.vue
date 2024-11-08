<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div style="display: flex; justify-content: space-between;">
      <div style="display: flex; align-items: center"></div>
      <div style="display: flex; align-items: center; gap:10px">
        <el-button type="success" size="large" round @click="downloadTemplate()"><el-icon :size="20"
            style="margin-right: 8px">
            <Download />
          </el-icon>Unduh Template</el-button>
        <el-upload :action="uploadUrl" :limit="1" accept="text/csv" :show-file-list="false" :on-success="handleSuccess"
          :on-error="handleError" :headers="headers">
          <el-button size="large" round><el-icon :size="20" style="margin-right: 8px">
              <Upload />
            </el-icon>Unggah</el-button></el-upload>
        <el-button type="primary" size="large" round @click="addActivity()"><el-icon :size="20"
            style="margin-right: 8px">
            <Plus />
          </el-icon>Tambah</el-button>
      </div>
    </div>

    <el-divider />
    <el-table ref="activitiesTableRef" v-loading="loading" :data="paginatedData" row-key="_id"
      style="width: 100%; flex: 1; margin-bottom: 20px;" @filter-change="handleFilterChange"
      @selection-change="handleSelection">

      <el-table-column type="selection" />

      <el-table-column prop="index" width="50" label="No" />
      <el-table-column label="Nama" sortable prop="name" />
      <el-table-column label="Kode Kegiatan" prop="code" />
      <el-table-column label="Unit" prop="unit" />
      <el-table-column label="Kategori" prop="category" :formatter="categoryFormatter" :filters="activityCategories"
        :filter-method="filterCategory" column-key="category" />
      <el-table-column label="Tim" prop="team" :filters="teams" :filter-method="filterTeam" column-key="team" />
      <el-table-column label="Tahun" prop="year" :filters="generateYear()" />
      <el-table-column align="center" label="Status" prop="isSpecial" :filters="[
        { text: 'Khusus', value: true },
        { text: 'Biasa', value: false },
      ]" :filter-method="filterIsSpecial" column-key="isSpecial">
        <template #default="scope">
          <el-tag effect="dark">{{ scope.row.isSpecial ? "Khusus" : "Biasa" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            Edit
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteActivity(scope.row._id)">
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
        <el-button @click="clearSelection()">Bersihkan Pilihan</el-button>
        <el-button @click="clearFilter()">Setel Ulang Penyaringan</el-button>
        <el-button @click="downloadSelection()" type="success">Unduh</el-button>
        <el-button @click="deleteSelection()" type="danger">Hapus</el-button>
      </div>
    </div>
  </div>

  <DialogFormEditActivity @close-dialog="handleCloseDialogFormEdit" :id="editedActivityId"
    :isShow="showDialogFormEdit" />
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Download, Plus, Upload } from "@element-plus/icons-vue";
import { getActivities, deleteActivity, deleteActivities, downloadActivities, downloadActivityTemplate } from "@/api/activityApi";
import { BASE_URL } from "@/api/api";
import { useAuthStore } from "@/stores/auth";
import { ElNotification, ElTable } from "element-plus";
import { teams, activityCategories } from "@/utils/constant";
import { createInitialFilter, type Filter } from "@/types/filter";
import type { Activity } from "@/types/activity";
import { generateYear } from "@/utils/date";

const router = useRouter();
const auth = useAuthStore();

const initialFilter = createInitialFilter("activity");

const headers = ref({
  Authorization: `Bearer ${auth.token}`,
});
const uploadUrl = ref(`${BASE_URL}/v1/activities/upload`);

const activitiesTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const activities = ref<any[]>([]);
const error = ref("");
const activitiesSelected = ref<any[]>([]);
const editedActivityId = ref(null);
const showDialogFormEdit = ref(false);
const filter = ref<Filter>(initialFilter);
const pageSize = ref(10)
const currentPage = ref(1);
const total = ref(0);

const paginatedData = computed(() => {
  let paginatedData: Activity[] = activities.value

  if (filter.value.team?.length) {
    paginatedData = paginatedData.filter((item) => {
      return filter.value.team?.includes(item.team);
    });
  }

  if (filter.value.category?.length) {
    paginatedData = paginatedData.filter((item) => {
      return filter.value.category?.includes(item.category);
    });
  }

  if (filter.value.isSpecial?.length) {
    paginatedData = paginatedData.filter((item) => {
      return filter.value.isSpecial?.includes(item.isSpecial);
    });
  }

  if (search.value) {
    paginatedData = paginatedData.filter(
      (data: any) =>
        !search.value ||
        data.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  total.value = paginatedData.length
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return paginatedData.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const clearFilter = () => {
  activitiesTableRef.value!.clearFilter();
  search.value = ""
  filter.value = {
    team: [],
    category: []
  }
};

const handleFilterChange = (newFilters: any) => {
  if (newFilters.team) {
    filter.value.team = newFilters.team
  }

  if (newFilters.category) {
    filter.value.category = newFilters.category
  }

  if (newFilters.isSpecial) {
    filter.value.isSpecial = newFilters.isSpecial
  }
}

const filterTeam = (value: string, row: any) => {
  return row.team == value
};

const filterIsSpecial = (value: boolean, row: any) => {
  return row.isSpecial == value
};

const filterCategory = (value: string, row: any) => {
  return row.category == value
};

const categoryFormatter = (row: any) => {
  if (row.category == "ENUMERATION") return "Pencacahan";
  if (row.category == "SUPERVISION") return "Pemeriksaan";
  if (row.category == "PROCESSING") return "Pengolahan";
};

const handleError = (
  error: Error,
) => {
  const result = JSON.parse(error.message);

  ElNotification({
    title: "Error",
    message: result.message,
    type: "error",
  });
};

const handleSuccess = async (
  response: any,
) => {
  ElNotification({
    title: "Success",
    message: response.message,
    type: "success",
  });

  await fetchData();
};

const handleSelection = (value: any[]) => {
  const activityIdsSelected = value.map((item) => item._id);

  activitiesSelected.value = activityIdsSelected;
};

const downloadSelection = () => {
  executeOperation(() => downloadActivities(activitiesSelected.value));
};

const deleteSelection = () => {
  executeOperation(() => deleteActivities(activitiesSelected.value));
};

const clearSelection = () => {
  activitiesTableRef.value!.clearSelection();
};

const downloadTemplate = () => {
  executeOperation(() => downloadActivityTemplate());
}

const addActivity = () => {
  router.push({ name: "addActivity" });
};

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

const handleDeleteActivity = (id: string) => {
  executeOperation(() => deleteActivity(id));
};

const handleCloseDialogFormEdit = async (refetch: boolean = false) => {
  editedActivityId.value = null;
  showDialogFormEdit.value = false;
  if (refetch) await fetchData();
};

const handleEdit = (index: number, row: any) => {
  editedActivityId.value = row._id;
  showDialogFormEdit.value = true;
};

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  try {
    activities.value = await getActivities();
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

.container-activity {
  margin: 10px;
}
</style>
