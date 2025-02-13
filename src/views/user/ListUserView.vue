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
      </div>
    </div>

    <el-divider />
    <el-table ref="usersTableRef" v-loading="loading" :data="paginatedData" row-key="_id"
      style="width: 100%; flex: 1; margin-bottom: 20px;">
      <el-table-column prop="index" width="50" label="No" />
      <el-table-column label="Nama" sortable prop="name" />
      <el-table-column label="NIP" prop="nip" />
      <el-table-column label="Tim" prop="team" :formatter="teamFormatter" />
      <el-table-column label="Posisi" prop="position" />

      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;  gap: 20px;">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
        :page-sizes="[10, 25, 50, 100, 500, 1000]" v-model:page-size="pageSize" :current-page="currentPage"
        @current-change="handlePageChange" class="pagination" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { downloadUserTemplate, getUsers } from "@/api/userApi";
import { Upload, Download } from "@element-plus/icons-vue";
import { ElNotification, ElTable } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { BASE_URL } from "@/api/api";

const usersTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const users = ref<any[]>([]);
const error = ref("");

const router = useRouter();
const auth = useAuthStore();
const headers = ref({
  Authorization: `Bearer ${auth.token}`,
});
const uploadUrl = ref(`${BASE_URL}/v1/users/upload`);
const pageSize = ref(10)
const currentPage = ref(1);

const total = computed(() => filterUsers.value.length);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filterUsers.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const teamFormatter = (row: any) => {
  if (row.team == null) return "-";
  return row.team;
};

const downloadTemplate = () => {
  executeOperation(() => downloadUserTemplate());
}

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

const filterUsers = computed(() => {
  return users.value.filter(
    (data: any) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const fetchData = async () => {
  loading.value = true;
  users.value = [];
  error.value = "";

  try {
    users.value = await getUsers();
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
