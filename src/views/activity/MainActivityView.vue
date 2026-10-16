<template>
  <section class="main-activity-page">
    <div class="page-heading">
      <div>
        <h1>Kegiatan Utama</h1>
        <p>Kelola Kegiatan Utama berdasarkan tahun dan tim. Master dapat digunakan bersama beberapa tim.</p>
      </div>
      <el-button type="primary" @click="openCreate">Tambah Kegiatan Utama</el-button>
    </div>

    <el-table v-loading="loading" :data="items" row-key="_id" stripe>
      <el-table-column prop="name" label="Nama Kegiatan Utama" min-width="240" />
      <el-table-column label="Tim" width="150">
        <template #default="{ row }">
          <el-tag v-for="teamId in row.team ?? []" :key="teamId" class="team-tag">{{ teams.find((team) => team.value === teamId)?.text ?? teamId }}</el-tag>
          <span v-if="!row.team?.length">Belum ditetapkan</span>
        </template>
      </el-table-column>
      <el-table-column prop="year" label="Tahun" width="110" />
      <el-table-column label="Kegiatan Terhubung" width="170">
        <template #default="{ row }">{{ row.activityCount ?? 0 }}</template>
      </el-table-column>
      <el-table-column label="Status" width="130">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? "Aktif" : "Nonaktif" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Aksi" width="230" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">Ubah</el-button>
          <el-button size="small" :type="row.isActive ? 'warning' : 'success'" @click="toggleActive(row)">
            {{ row.isActive ? "Nonaktifkan" : "Aktifkan" }}
          </el-button>
          <el-button size="small" type="danger" @click="remove(row)">Hapus</el-button>
        </template>
      </el-table-column>
      <template #empty><el-empty description="Belum ada Kegiatan Utama" /></template>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editing ? 'Ubah Kegiatan Utama' : 'Tambah Kegiatan Utama'" width="min(520px, 92vw)">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="Nama Kegiatan Utama" prop="name">
          <el-input v-model="form.name" maxlength="150" show-word-limit placeholder="Contoh: Survei A" />
        </el-form-item>
        <el-form-item label="Tim" prop="team">
          <el-select v-model="form.team" placeholder="Pilih satu atau beberapa tim" filterable multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="team in teams" :key="team.value" :label="team.text" :value="team.value" :disabled="!isTu && team.value === user.team" />
          </el-select>
          <small v-if="!isTu">Anda dapat menambahkan tim lain. Tim Anda harus tetap dipilih.</small>
          <small v-if="editing && (editing.activityCount ?? 0) > 0" class="field-hint">Tim yang memiliki Kegiatan terhubung harus tetap dipilih.</small>
        </el-form-item>
        <el-form-item label="Tahun" prop="year">
          <el-input-number v-model="form.year" :min="2000" :max="2100" :disabled="Boolean(editing && (editing.activityCount ?? 0) > 0)" controls-position="right" />
          <small v-if="editing && (editing.activityCount ?? 0) > 0" class="field-hint">Tahun tidak dapat diubah setelah Kegiatan terhubung.</small>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Batal</el-button>
        <el-button type="primary" :loading="saving" @click="save">Simpan</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { createMainActivity, deleteMainActivity, getMainActivities, updateMainActivity } from "@/api/mainActivityApi";
import type { MainActivity } from "@/types/mainActivity";
import { useUserStore } from "@/stores/user";
import { teams } from "@/utils/constant";
import type { Team } from "@/types/user";

type MainActivityRow = MainActivity;
const items = ref<MainActivityRow[]>([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const editing = ref<MainActivityRow | null>(null);
const user = useUserStore();
const isTu = computed(() => user.team === "TU");
const form = reactive<{ name: string; year: number; team: Team[] }>({ name: "", year: new Date().getFullYear(), team: [] });
const rules: FormRules = {
  name: [{ required: true, whitespace: true, message: "Nama Kegiatan Utama wajib diisi", trigger: "blur" }],
  year: [{ required: true, message: "Tahun wajib diisi", trigger: "change" }],
  team: [{ validator: (_rule, value, callback) => {
    if (!Array.isArray(value) || !value.length) callback(new Error("Pilih minimal satu tim"));
    else callback();
  }, trigger: "change" }],
};

const refresh = async () => {
  loading.value = true;
  try {
    items.value = await getMainActivities(undefined, false, isTu.value ? undefined : user.team);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "Gagal memuat data");
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  editing.value = null;
  form.name = "";
  form.year = new Date().getFullYear();
  form.team = isTu.value ? [] : user.team ? [user.team as Team] : [];
  dialogVisible.value = true;
};

const openEdit = (row: MainActivityRow) => {
  editing.value = row;
  form.name = row.name;
  form.year = row.year;
  form.team = Array.isArray(row.team) ? [...row.team] : row.team ? [row.team as unknown as Team] : [];
  dialogVisible.value = true;
};

const save = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  saving.value = true;
  try {
    if (editing.value) {
      const payload: Partial<MainActivity> = { name: form.name, year: form.year, team: form.team };
      await updateMainActivity(editing.value._id, payload);
    } else {
      await createMainActivity({ name: form.name, year: form.year, team: form.team });
    }
    dialogVisible.value = false;
    ElMessage.success("Kegiatan Utama berhasil disimpan");
    await refresh();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "Gagal menyimpan Kegiatan Utama");
  } finally {
    saving.value = false;
  }
};

const toggleActive = async (row: MainActivityRow) => {
  try {
    await updateMainActivity(row._id, { isActive: !row.isActive });
    ElMessage.success("Status Kegiatan Utama diperbarui");
    await refresh();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "Gagal memperbarui status");
  }
};

const remove = async (row: MainActivityRow) => {
  try {
    await deleteMainActivity(row._id);
    ElMessage.success("Kegiatan Utama berhasil dihapus");
    await refresh();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "Gagal menghapus Kegiatan Utama");
  }
};

onMounted(refresh);
</script>

<style scoped>
.main-activity-page { padding: 8px 4px; }
.page-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.page-heading h1 { margin: 0 0 6px; font-size: 24px; }
.page-heading p, .field-hint { color: var(--el-text-color-secondary); }
.page-heading p { margin: 0; }
.field-hint { display: block; margin-top: 8px; }
.team-tag { margin: 2px; }
</style>