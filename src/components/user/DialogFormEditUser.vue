<template>
    <el-dialog :model-value="isShow" title="Ubah Pengguna" width="500" :before-close="handleClose">
        <el-form :model="form" ref="formRef" label-width="auto" label-position="top" :rules="rules" v-loading="loading">
            <el-form-item required label="Nama" prop="name">
                <el-input v-model="form.name" placeholder="Masukkan Nama Pengguna" />
            </el-form-item>
            <el-form-item required label="NIP" prop="nip">
                <el-input v-model="form.nip" placeholder="Masukkan NIP (18 digit)" maxlength="18" />
            </el-form-item>
            <el-form-item required label="Email" prop="email">
                <el-input v-model="form.email" placeholder="Masukkan Email" />
            </el-form-item>
            <el-form-item label="Kata Sandi Baru" prop="password">
                <el-input v-model="form.password" type="password" show-password
                    placeholder="Kosongkan jika tidak diubah" />
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
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">Cancel</el-button>
                <el-button type="primary" @click="update(formRef)">Perbarui</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import { updateUser } from "@/api/userApi";
import { teams } from "@/utils/constant";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";

const props = defineProps<{ user: any | null; isShow: boolean }>();
const emit = defineEmits(["closeDialog"]);

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
    position: [{ required: true, message: "Posisi perlu dipilih", trigger: "change" }],
});

const handleClose = () => emit("closeDialog");

const update = (formEl: FormInstance | undefined) => {
    if (!formEl || !props.user) return;

    formEl.validate(async (valid) => {
        if (!valid) return;

        loading.value = true;

        try {
            const { message } = await updateUser(props.user._id, form);
            ElNotification({ title: "Success", message, type: "success" });
            emit("closeDialog", true);
        } catch (e) {
            if (e instanceof Error) {
                ElNotification({ title: "Error", message: e.message, type: "error" });
            }
        } finally {
            loading.value = false;
        }
    });
};

watch(() => props.user, (user) => {
    if (!user) return;

    form.name = user.name;
    form.nip = user.nip;
    form.email = user.email;
    form.password = "";
    form.team = user.team ?? "";
    form.position = user.position;
}, { immediate: true });
</script>
