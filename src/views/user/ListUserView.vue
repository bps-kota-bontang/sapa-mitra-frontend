<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center"></div>
      <div style="display: flex; align-items: center"></div>
    </div>

    <el-divider />
    <el-table
      ref="usersTableRef"
      v-loading="loading"
      :data="filterUsers"
      row-key="_id"
      style="width: 100%"
    >
      <el-table-column type="index" label="No" />
      <el-table-column label="Nama" sortable prop="name" />
      <el-table-column label="NIP" prop="nip" />
      <el-table-column label="Tim" prop="team" />
      <el-table-column label="Posisi" prop="position" />

      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
          />
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { getUsers } from "@/api/employeeApi";

const usersTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const users = ref<any[]>([]);
const error = ref("");

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
