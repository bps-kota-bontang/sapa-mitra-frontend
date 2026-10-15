<template>
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="auto" label-position="top">
    <el-form-item required label="Nama" prop="name">
      <el-input v-model="form.name" placeholder="Masukkan Nama Pengguna" />
    </el-form-item>
    <el-form-item required label="NIP" prop="nip">
      <el-input v-model="form.nip" placeholder="Masukkan NIP (18 digit)" maxlength="18" />
    </el-form-item>
    <el-form-item required label="Email" prop="email">
      <el-input v-model="form.email" placeholder="Masukkan Email" />
    </el-form-item>
    <el-form-item required label="Kata Sandi" prop="password">
      <el-input v-model="form.password" type="password" show-password placeholder="Masukkan Kata Sandi" />
    </el-form-item>
    <el-form-item label="Tim" prop="team">
      <el-select v-model="form.team" clearable placeholder="Pilih Tim" style="width: 100%">
        <el-option v-for="item in teams" :key="item.value" :label="item.text" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item required label="Posisi" prop="position">
      <el-select v-model="form.position" placeholder="Pilih Posisi" style="width: 100%">
        <el-option v-for="item in positions" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item style="margin-top: 20px">
      <el-button @click="submit(formRef)" type="primary">Tambah</el-button>
      <el-button @click="reset(formRef)">Bersihkan</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { createUser } from "@/api/userApi";
import { teams } from "@/utils/constant";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";

const positions = ["ANGGOTA", "KETUA", "KEPALA"];

const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({
  name: "",
  nip: "",
  email: "",
  password: "",
  team: "",
  position: "",
});

const rules = reactive<FormRules<any>>({
  name: [{ required: true, message: "Nama perlu terisi", trigger: "blur" }],
  nip: [
    { required: true, message: "NIP perlu terisi", trigger: "blur" },
    { len: 18, message: "NIP harus 18 digit", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Email perlu terisi", trigger: "blur" },
    { type: "email", message: "Format email tidak valid", trigger: "blur" },
  ],
  password: [{ required: true, message: "Kata sandi perlu terisi", trigger: "blur" }],
  position: [{ required: true, message: "Posisi perlu dipilih", trigger: "change" }],
});

const notify = (type: "success" | "error", message: string) => {
  ElNotification({ title: type === "success" ? "Success" : "Error", message, type });
};

const reset = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
};

const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    try {
      const { message } = await createUser(form);
      notify("success", message);
      formEl.resetFields();
    } catch (e) {
      if (e instanceof Error) notify("error", e.message);
    } finally {
      loading.value = false;
    }
  });
};
</script>
