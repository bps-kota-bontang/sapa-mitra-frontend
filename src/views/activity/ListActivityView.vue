<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center"></div>
      <div style="display: flex; align-items: center">
        <el-upload
          :action="uploadUrl"
          :limit="1"
          accept="text/csv"
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :headers="headers"
        >
          <el-button size="large" round
            ><el-icon :size="20" style="margin-right: 8px"><Upload /></el-icon
            >Upload</el-button
          ></el-upload
        >
        <el-button type="primary" size="large" round @click="addActivity()"
          ><el-icon :size="20" style="margin-right: 8px"><Plus /></el-icon
          >Tambah</el-button
        >
      </div>
    </div>

    <el-divider />
    <el-table
      ref="activitiesTableRef"
      v-loading="loading"
      :data="filterActivities"
      row-key="_id"
      style="width: 100%"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" />

      <el-table-column type="index" label="No" />
      <el-table-column label="Nama" sortable prop="name" />
      <el-table-column label="Kode Kegiatan" prop="code" />

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
            type="danger"
            @click="handleDeleteActivity(scope.row._id)"
          >
            Hapus
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="clearSelection()">Bersihkan Pilihan</el-button>
      <el-button @click="deleteSelection()" type="danger">Hapus</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Printer, Plus, Upload } from "@element-plus/icons-vue";
import { getActivities, deleteActivity } from "@/api/activityApi";
import { useUserStore } from "@/stores/user";
import { BASE_URL } from "@/api/api";

const router = useRouter();
const route = useRoute();
const user = useUserStore();

const headers = ref({
  Authorization: `Bearer ${user.token}`,
});
const uploadUrl = ref(`${BASE_URL}/v1/activities/upload`);

const activitiesTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const activities = ref<any[]>([]);
const error = ref("");
const activitiesSelected = ref<any[]>([]);

const handleError = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
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
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  ElNotification({
    title: "Success",
    message: response.message,
    type: "success",
  });

  await fetchData();
};

const filterActivities = computed(() => {
  return activities.value.filter(
    (data: any) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const handleSelection = (value: any[]) => {
  const activityIdsSelected = value.map((item) => item._id);

  activitiesSelected.value = activityIdsSelected;
};

const deleteSelection = () => {
  console.log(activitiesSelected.value);
};

const clearSelection = () => {
  activitiesTableRef.value!.clearSelection();
};

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

const handleEdit = (index: number, row: any) => {
  console.log(index, row);
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
