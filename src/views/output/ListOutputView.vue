<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center"></div>
      <div style="display: flex; align-items: center">
        <el-button type="primary" size="large" round @click="addOutput()"
          ><el-icon :size="20" style="margin-right: 8px"><Plus /></el-icon
          >Tambah</el-button
        >
      </div>
    </div>

    <el-divider />
    <el-table
      ref="outputsTableRef"
      v-loading="loading"
      :data="filterOutputs"
      height="850px"
      row-key="_id"
      style="width: 100%"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" />

      <el-table-column type="index" label="No" />
      <el-table-column label="Nama" sortable prop="name" />
      <el-table-column label="Satuan" prop="unit" />

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
            @click="handleDeleteOutput(scope.row._id)"
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
import { Printer, Plus } from "@element-plus/icons-vue";
import { getOutputs, deleteOutput } from "@/api/outputApi";

const router = useRouter();
const route = useRoute();

const outputsTableRef = ref<InstanceType<typeof ElTable>>();
const search = ref("");
const loading = ref(false);
const outputs = ref<any[]>([]);
const error = ref("");
const outputsSelected = ref<any[]>([]);

const filterOutputs = computed(() => {
  return outputs.value.filter(
    (data: any) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const handleSelection = (value: any[]) => {
  const outputIdsSelected = value.map((item) => item._id);

  outputsSelected.value = outputIdsSelected;
};

const deleteSelection = () => {
  console.log(outputsSelected.value);
};

const clearSelection = () => {
  outputsTableRef.value!.clearSelection();
};

const addOutput = () => {
  router.push({ name: "addOutput" });
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

const handleDeleteOutput = (id: string) => {
  executeOperation(() => deleteOutput(id));
};

const handleEdit = (index: number, row: any) => {
  console.log(index, row);
};

const fetchData = async () => {
  loading.value = true;
  outputs.value = [];
  error.value = "";

  try {
    outputs.value = await getOutputs();
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
