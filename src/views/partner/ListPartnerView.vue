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
        <el-button type="primary" size="large" round @click="addPartner()"
          ><el-icon :size="20" style="margin-right: 8px"><Plus /></el-icon
          >Tambah</el-button
        >
      </div>
    </div>

    <el-divider />
    <el-table
      ref="partnersTableRef"
      v-loading="loading"
      :data="filterPartners"
      row-key="_id"
      style="width: 100%"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" />

      <el-table-column type="index" label="No" />
      <el-table-column label="Nama" sortable prop="name" />
      <el-table-column label="NIK" prop="nik" />
      <el-table-column label="Alamat" prop="address" />

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
            @click="handleDeletePartner(scope.row._id)"
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
import { getPartners, deletePartner } from "@/api/partnerApi";
import { useUserStore } from "@/stores/user";
import { BASE_URL } from "@/api/api";

const router = useRouter();
const route = useRoute();
const user = useUserStore();

const headers = ref({
  Authorization: `Bearer ${user.token}`,
});
const uploadUrl = ref(`${BASE_URL}/v1/partners/upload`);

const partnersTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const partners = ref<any[]>([]);
const error = ref("");
const partnersSelected = ref<any[]>([]);

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

const filterPartners = computed(() => {
  return partners.value.filter(
    (data: any) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const handleSelection = (value: any[]) => {
  const partnerIdsSelected = value.map((item) => item._id);

  partnersSelected.value = partnerIdsSelected;
};

const deleteSelection = () => {
  console.log(partnersSelected.value);
};

const clearSelection = () => {
  partnersTableRef.value!.clearSelection();
};

const addPartner = () => {
  router.push({ name: "addPartner" });
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

const handleDeletePartner = (id: string) => {
  executeOperation(() => deletePartner(id));
};

const handleEdit = (index: number, row: any) => {
  console.log(index, row);
};

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  try {
    partners.value = await getPartners();
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

.container-partner {
  margin: 10px;
}
</style>
