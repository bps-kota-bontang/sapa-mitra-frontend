<template>
  <section class="sk-page">
    <div class="page-heading">
      <div>
        <h1>Surat Keputusan</h1>
        <p>Kelola SK dan sinkronkan petugas Mitra Statistik dari SPK.</p>
      </div>
      <el-button type="primary" @click="openCreate">Buat SK</el-button>
    </div>

    <el-table v-loading="loading" :data="items" row-key="_id" stripe>
      <el-table-column prop="number" label="Nomor SK" min-width="190" sortable />
      <el-table-column prop="mainActivityName" label="Kegiatan Utama" min-width="240" sortable />
      <el-table-column prop="date" label="Tanggal" width="150" sortable>
        <template #default="{ row }">{{ formatDate(row.date) }}</template>
      </el-table-column>
      <el-table-column label="Petugas" width="110" sortable :sort-method="sortByStaffCount">
        <template #default="{ row }">{{ row.staff?.length ?? 0 }}</template>
      </el-table-column>
      <el-table-column label="Aksi" width="230" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">Ubah</el-button>
          <el-button size="small" type="success" @click="downloadPdf(row)">PDF</el-button>
          <el-button size="small" type="danger" @click="remove(row)">Hapus</el-button>
        </template>
      </el-table-column>
      <template #empty><el-empty description="Belum ada SK" /></template>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editing ? 'Ubah SK' : 'Buat SK'" width="min(1200px, 98vw)" top="4vh" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="form-grid">
          <el-form-item label="Kegiatan Utama" prop="mainActivityId">
            <el-select v-model="form.mainActivityId" placeholder="Pilih Kegiatan Utama" filterable @change="handleMainActivityChange">
              <el-option v-for="activity in mainActivities" :key="activity._id" :label="`${activity.name} (${activity.year})`" :value="activity._id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Nomor SK" prop="number">
            <el-input v-model="form.number" maxlength="150" placeholder="Masukkan nomor SK" />
          </el-form-item>
          <el-form-item label="Tanggal SK" prop="date">
            <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" format="DD/MM/YYYY" placeholder="Pilih tanggal" />
          </el-form-item>
        </div>
        <div class="staff-heading">
          <div>
            <h2>Daftar Petugas <el-tag>{{ form.staff.length }}</el-tag></h2>
            <p>Hasil sinkron hanya satu baris per nama; jika muncul pada beberapa SPK/kegiatan, data terbaru yang dipakai. Petugas juga dapat ditambahkan manual.</p>
          </div>
          <div class="staff-actions">
            <el-button :disabled="!form.mainActivityId" :loading="syncing" @click="syncStaff">Sinkronkan SPK</el-button>
            <el-button type="primary" @click="openAddManual">Tambah Petugas</el-button>
          </div>
        </div>
        <el-table :data="form.staff" row-key="rowKey" border max-height="440">
          <el-table-column prop="name" label="Nama" min-width="180" sortable />
          <el-table-column prop="title" label="Jabatan" min-width="150" sortable>
            <template #default="{ row }">{{ row.title }}</template>
          </el-table-column>
          <el-table-column prop="activityName" label="Kegiatan" min-width="200" sortable>
            <template #default="{ row }">{{ row.source === 'PARTNER' ? row.activityName : '—' }}</template>
          </el-table-column>
          <el-table-column prop="position" label="Posisi" width="170" sortable>
            <template #default="{ row }">{{ positionLabel(row.position) }}</template>
          </el-table-column>
          <el-table-column prop="honorRate" label="Rate Honor" width="170" align="right" sortable>
            <template #default="{ row }">{{ formatRate(row.honorRate) }}</template>
          </el-table-column>
          <el-table-column prop="source" label="Sumber" width="130" sortable>
            <template #default="{ row }"><el-tag :type="row.source === 'PARTNER' ? 'success' : 'info'">{{ row.source === 'PARTNER' ? 'SPK' : 'Manual' }}</el-tag></template>
          </el-table-column>
          <el-table-column label="Aksi" width="150" fixed="right">
            <template #default="{ row, $index }">
              <el-button size="small" @click="editStaff($index)">Ubah</el-button>
              <el-button size="small" type="danger" @click="removeStaff($index)">Hapus</el-button>
            </template>
          </el-table-column>
          <template #empty><el-empty description="Belum ada petugas. Sinkronkan data SPK atau tambahkan petugas manual." /></template>
        </el-table>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Batal</el-button>
        <el-button type="primary" :loading="saving" @click="save">Simpan SK</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="manualDialogVisible" :title="manualIndex === null ? 'Tambah Petugas' : 'Ubah Petugas'" width="min(520px, 95vw)" append-to-body>
      <el-form ref="manualFormRef" :model="manualForm" :rules="manualRules" label-position="top">
        <el-form-item label="Nama" prop="name"><el-input v-model="manualForm.name" maxlength="200" /></el-form-item>
        <el-form-item label="Jabatan" prop="title"><el-input v-model="manualForm.title" maxlength="150" placeholder="Masukkan jabatan" /></el-form-item>
        <el-form-item label="Posisi" prop="position">
          <el-select v-model="manualForm.position" placeholder="Pilih posisi">
            <el-option v-for="option in positionOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Rate Honor (opsional)" prop="honorRate">
          <el-input-number v-model="manualForm.honorRate" :min="0" :precision="0" :controls="false" clearable placeholder="Kosongkan jika tidak ada" />
          <small class="hint">Nilai kosong disimpan sebagai null, bukan 0.</small>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="manualDialogVisible = false">Batal</el-button>
        <el-button type="primary" @click="saveManual">Simpan Petugas</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import Handlebars from "handlebars";
import html2pdf from "html2pdf.js/src";
import { createSK, deleteSK, getSKs, syncSKStaff, updateSK } from "@/api/skApi";
import { getMainActivities } from "@/api/mainActivityApi";
import type { MainActivity } from "@/types/mainActivity";
import type { SKDocument, SKPosition, SKStaff } from "@/types/sk";
import skTemplate from "@/templates/sk.html?raw";

type StaffRow = SKStaff & { rowKey: string };
const items = ref<SKDocument[]>([]);
const mainActivities = ref<MainActivity[]>([]);
const loading = ref(false);
const syncing = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const manualDialogVisible = ref(false);
const editing = ref<SKDocument | null>(null);
const formRef = ref<FormInstance>();
const manualFormRef = ref<FormInstance>();
const manualIndex = ref<number | null>(null);
const form = reactive<{ mainActivityId: string; number: string; date: string; staff: StaffRow[] }>({ mainActivityId: "", number: "", date: "", staff: [] });
const manualForm = reactive<{ name: string; title: string; position: SKPosition | ""; honorRate: number | null }>({ name: "", title: "", position: "", honorRate: null });
const positionOptions: { value: SKPosition; label: string }[] = [
  { value: "PENDATAAN", label: "Petugas Pendataan" },
  { value: "PEMERIKSAAN", label: "Petugas Pemeriksaan" },
  { value: "PENGOLAHAN", label: "Petugas Pengolahan" },
];
const rules: FormRules = {
  mainActivityId: [{ required: true, message: "Pilih Kegiatan Utama", trigger: "change" }],
  number: [{ required: true, whitespace: true, message: "Nomor SK wajib diisi", trigger: "blur" }],
  date: [{ required: true, message: "Tanggal SK wajib diisi", trigger: "change" }],
};
const manualRules: FormRules = {
  name: [{ required: true, whitespace: true, message: "Nama wajib diisi", trigger: "blur" }],
  title: [{ required: true, whitespace: true, message: "Jabatan wajib diisi", trigger: "blur" }],
  position: [{ required: true, message: "Pilih posisi", trigger: "change" }],
};

const load = async () => {
  loading.value = true;
  try {
    const [skRecords, activityRecords] = await Promise.all([getSKs(), getMainActivities(undefined, false)]);
    items.value = skRecords;
    mainActivities.value = activityRecords;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "Gagal memuat data SK");
  } finally {
    loading.value = false;
  }
};
const asRow = (staff: SKStaff): StaffRow => ({ ...staff, rowKey: `${staff.source}-${staff.partnerNik ?? "manual"}-${staff.activityId ?? crypto.randomUUID()}` });
const openCreate = () => {
  editing.value = null;
  form.mainActivityId = "";
  form.number = "";
  form.date = new Date().toISOString().slice(0, 10);
  form.staff = [];
  dialogVisible.value = true;
};
const openEdit = (record: SKDocument) => {
  editing.value = record;
  form.mainActivityId = record.mainActivityId;
  form.number = record.number;
  form.date = new Date(record.date).toISOString().slice(0, 10);
  form.staff = (record.staff ?? []).map(asRow);
  dialogVisible.value = true;
};
const handleMainActivityChange = (selected: string) => {
  if (editing.value && selected === editing.value.mainActivityId) return;
  form.staff = form.staff.filter((staff) => staff.source === "MANUAL");
};
const syncStaff = async () => {
  if (!form.mainActivityId) return;
  syncing.value = true;
  try {
    const [synced, activity] = await Promise.all([
      syncSKStaff(form.mainActivityId),
      Promise.resolve(mainActivities.value.find((item) => item._id === form.mainActivityId)),
    ]);
    const manual = form.staff.filter((staff) => staff.source === "MANUAL");
    form.staff = [...synced.map((staff) => asRow(staff)), ...manual];
    ElMessage.success(`${synced.length} baris petugas Mitra Statistik disinkronkan dari ${activity?.name ?? "Kegiatan Utama"}`);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "Gagal menyinkronkan SPK");
  } finally {
    syncing.value = false;
  }
};
const openAddManual = () => {
  manualIndex.value = null;
  Object.assign(manualForm, { name: "", title: "", position: "", honorRate: null });
  manualDialogVisible.value = true;
};
const editStaff = (index: number) => {
  const staff = form.staff[index];
  manualIndex.value = index;
  Object.assign(manualForm, { name: staff.name, title: staff.title, position: staff.position, honorRate: staff.honorRate ?? null });
  manualDialogVisible.value = true;
};
const saveManual = async () => {
  const valid = await manualFormRef.value?.validate().catch(() => false);
  if (!valid || !manualForm.position) return;
  const values = {
    name: manualForm.name.trim(),
    title: manualForm.title.trim(),
    position: manualForm.position,
    honorRate: manualForm.honorRate === null ? null : Number(manualForm.honorRate),
  };
  if (manualIndex.value === null) {
    form.staff.push(asRow({ source: "MANUAL", ...values }));
  } else {
    const existing = form.staff[manualIndex.value];
    form.staff.splice(manualIndex.value, 1, { ...existing, ...values });
  }
  manualDialogVisible.value = false;
};
const removeStaff = (index: number) => form.staff.splice(index, 1);
const save = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  saving.value = true;
  try {
    const payload = {
      mainActivityId: form.mainActivityId,
      number: form.number.trim(),
      date: form.date,
      staff: form.staff.map(({ rowKey: _rowKey, ...staff }) => ({ ...staff, honorRate: staff.honorRate ?? null })),
    };
    if (editing.value) await updateSK(editing.value._id, payload);
    else await createSK(payload);
    dialogVisible.value = false;
    ElMessage.success("SK berhasil disimpan");
    await load();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "Gagal menyimpan SK");
  } finally {
    saving.value = false;
  }
};
const remove = async (record: SKDocument) => {
  try {
    await ElMessageBox.confirm(`Hapus SK ${record.number}?`, "Konfirmasi", { type: "warning" });
    await deleteSK(record._id);
    ElMessage.success("SK berhasil dihapus");
    await load();
  } catch (error) {
    if (error !== "cancel" && error !== "close") ElMessage.error(error instanceof Error ? error.message : "Gagal menghapus SK");
  }
};
const positionLabel = (position: SKPosition) => positionOptions.find((item) => item.value === position)?.label ?? position;
const formatDate = (date: string | Date) => new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));
const formatRate = (rate: number | null | undefined) => rate === null || rate === undefined ? "—" : new Intl.NumberFormat("id-ID").format(rate);
const sortByStaffCount = (a: SKDocument, b: SKDocument) => (a.staff?.length ?? 0) - (b.staff?.length ?? 0);
const downloadPdf = async (record: SKDocument) => {
  const template = Handlebars.compile(skTemplate);
  Handlebars.registerHelper("uppercase", (value: string) => value?.toLocaleUpperCase("id-ID") ?? "");
  Handlebars.registerHelper("inc", (value: number) => value + 1);
  const dateText = formatDate(record.date);
  const staff = record.staff.map((person) => ({
    ...person,
    positionLabel: positionLabel(person.position),
    honorRateText: formatRate(person.honorRate),
  }));
  const html = template({ ...record, dateText, staff });
  await html2pdf().set({
    margin: [10, 12, 10, 12],
    filename: `SK-${record.number.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }).from(html).save();
};

onMounted(load);
</script>

<style scoped>
.sk-page { padding: 8px 4px; }
.page-heading, .staff-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.page-heading { margin-bottom: 20px; }
.page-heading h1 { margin: 0 0 6px; font-size: 24px; }
.page-heading p, .staff-heading p, .hint { color: var(--el-text-color-secondary); }
.page-heading p, .staff-heading p { margin: 0; }
.form-grid { display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 16px; }
.form-grid .el-select, .form-grid .el-date-editor { width: 100%; }
.staff-heading { align-items: end; margin: 8px 0 16px; }
.staff-heading h2 { font-size: 18px; margin: 0 0 6px; }
.staff-actions { display: flex; gap: 8px; }
.hint { display: block; margin-top: 6px; }
@media (max-width: 760px) { .page-heading, .staff-heading { align-items: stretch; flex-direction: column; } .form-grid { grid-template-columns: 1fr; gap: 0; } .staff-actions { flex-wrap: wrap; } }
</style>
