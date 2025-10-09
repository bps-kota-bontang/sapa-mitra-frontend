<template>
    <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="auto" label-position="top">
        <el-form-item required label="Kata Sandi Lama" prop="oldPassword">
            <el-input v-model="form.oldPassword" type="password" placeholder="Masukkan Kata Sandi Lama" />
        </el-form-item>
        <el-form-item required label="Kata Sandi Baru" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" placeholder="Masukkan Kata Sandi Baru" />
        </el-form-item>
        <el-form-item required label="Konfirmasi Kata Sandi Baru" prop="confirmNewPassword">
            <el-input v-model="form.confirmNewPassword" type="password"
                placeholder="Masukkan Konfirmasi Kata Sandi Baru" />
        </el-form-item>

        <el-form-item required style="margin-top: 20px">
            <el-button @click="submit(formRef)" type="primary">Tambah</el-button>
            <el-button @click="reset(formRef)">Bersihkan</el-button>
        </el-form-item>
    </el-form>
</template>


<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { updatePassword } from "@/api/userApi";

const formRef = ref<FormInstance>();

const validatePassword = (rule: any, value: any, callback: any) => {
    if (value !== form.newPassword) {
        callback(new Error("Konfirmasi password tidak sama"))
    } else {
        callback()
    }
}

const rules = reactive<FormRules<any>>({
    oldPassword: [
        {
            required: true,
            message: "Kata sandi lama perlu terisi",
            trigger: "blur",
        },
    ],
    newPassword: [
        {
            required: true,
            message: "Kata sandi baru perlu terisi",
            trigger: "blur",
        },
    ],
    confirmNewPassword: [
        {
            required: true,
            message: "Konfirmasi kata sandi baru perlu terisi",
            trigger: "blur",
        },
        { validator: validatePassword, trigger: 'blur' }
    ],
});

const initialState = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

let feedback = ref({
    title: "",
    message: "",
    type: "",
});
const loading = ref(false);
const form = reactive({ ...initialState });

const reset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};

const submit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid) => {
        loading.value = true;

        if (!valid) {
            loading.value = false;
            return;
        }

        try {
            const { data, message } = await updatePassword(form);
            feedback.value = {
                title: "Success",
                message: message,
                type: "success",
            };

            if (formRef.value) {
                formRef.value.resetFields();
            }
        } catch (e) {
            if (e instanceof Error) {
                feedback.value = {
                    title: "Error",
                    message: e.message,
                    type: "error",
                };
            }
        } finally {
            loading.value = false;
        }
    });
};

watch(
    () => feedback.value,
    (feedback: any) => {
        if (feedback.message != "") {
            ElNotification({
                title: feedback.title,
                message: feedback.message,
                type: feedback.type,
            });
        }
    },
    { immediate: true }
);
</script>
