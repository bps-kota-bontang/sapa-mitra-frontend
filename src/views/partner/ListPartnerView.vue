<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div style="display: flex; justify-content: space-between">
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
            </el-icon>Upload</el-button></el-upload>
        <el-button type="primary" size="large" round @click="addPartner()"><el-icon :size="20"
            style="margin-right: 8px">
            <Plus />
          </el-icon>Tambah</el-button>
      </div>
    </div>
    <el-divider />
    <el-table ref="partnersTableRef" v-loading="loading" :data="paginatedData" row-key="_id"
      style="width: 100%; flex: 1; margin-bottom: 20px;" @selection-change="handleSelection">
      <el-table-column type="selection" />

      <el-table-column prop="index" width="50" label="No" />
      <el-table-column label="Nama" sortable prop="name" />
      <el-table-column label="NIK" prop="nik" />
      <el-table-column label="Alamat" prop="address" />
      <el-table-column label="Tahun" prop="year" :filters="generateYear()" />

      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            Edit
          </el-button>
          <el-button size="small" type="danger" @click="handleDeletePartner(scope.row._id)">
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
        <el-button @click="deleteSelection()" type="danger">Hapus</el-button>
      </div>
    </div>
  </div>
  <DialogFormEditPartner @close-dialog="handleCloseDialogFormEdit" :id="editedPartnerId" :isShow="showDialogFormEdit" />
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Download, Plus, Upload } from "@element-plus/icons-vue";
import { getPartners, deletePartner, deletePartners, downloadPartnerTemplate } from "@/api/partnerApi";
import { BASE_URL } from "@/api/api";
import { ElNotification, ElTable } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { generateYear } from "@/utils/date";

const router = useRouter();
const route = useRoute();
const user = useAuthStore();

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
const editedPartnerId = ref(null);
const showDialogFormEdit = ref(false);

const pageSize = ref(10)
const currentPage = ref(1);

const total = computed(() => filterPartners.value.length);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filterPartners.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
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

const filterPartners = computed(() => {
  return partners.value.filter(
    (data: any) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const downloadTemplate = () => {
  executeOperation(() => downloadPartnerTemplate());
}

const handleSelection = (value: any[]) => {
  const partnerIdsSelected = value.map((item) => item._id);

  partnersSelected.value = partnerIdsSelected;
};

const deleteSelection = () => {
  executeOperation(() => deletePartners(partnersSelected.value));
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

const handleCloseDialogFormEdit = async (refetch: boolean = false) => {
  editedPartnerId.value = null;
  showDialogFormEdit.value = false;
  if (refetch) await fetchData();
};

const handleEdit = (index: number, row: any) => {
  editedPartnerId.value = row._id;
  showDialogFormEdit.value = true;
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
