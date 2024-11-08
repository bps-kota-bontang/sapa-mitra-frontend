<template>
    <el-dialog v-model="props.isShow" title="Ubah Mitra" width="500" :before-close="handleClose">
        <el-form :model="form" ref="formRef" label-width="auto" label-position="top" :rules="rules" v-loading="loading">
            <el-form-item required label="Nama" prop="name">
                <el-input v-model="form.name" placeholder="Masukkan Nama Mitra" />
            </el-form-item>
            <el-form-item required label="NIK" prop="nik">
                <el-input v-model="form.nik" type="number" placeholder="Masukkan NIK Mitra" />
            </el-form-item>
            <el-form-item required label="Alamat" prop="address">
                <el-input v-model="form.address" placeholder="Masukkan Alamat Mitra" />
            </el-form-item>
            <el-form-item required label="Tahun Mitra" prop="year">
                <el-input v-model="form.year" placeholder="Masukkan Tahun Mitra" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">Cancel</el-button>
                <el-button type="primary" @click="update(formRef)">
                    Perbarui
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import { getPartner, updatePartner } from "@/api/partnerApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";

const initialState = {
    name: "",
    nik: "",
    address: "",
    year: "",
};

const rules = reactive<FormRules<any>>({
    name: [
        {
            required: true,
            message: "Nama Mitra perlu terisi",
            trigger: "blur",
        },
    ],
    nik: [
        {
            required: true,
            message: "NIK mitra perlu terisi",
            trigger: "blur",
        },
        { min: 16, max: 16, message: "NIK harus 16 digit", trigger: "blur" },
    ],
    address: [
        {
            required: true,
            message: "Alamat Mitra perlu terisi",
            trigger: "blur",
        },
    ],
    year: [
        {
            required: true,
            message: "Tahun Mitra perlu terisi",
            trigger: "blur",
        },
    ],
});

const formRef = ref<FormInstance>();
const form = reactive({ ...initialState });
const feedback = ref({
    title: "",
    message: "",
    type: "",
});
const emit = defineEmits(['closeDialog'])


const props: any = defineProps({
    id: String,
    isShow: Boolean,
});

const loading = ref(false);
const handleClose = () => {
    emit('closeDialog')
}

const update = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid) => {
        loading.value = true;


        if (!valid) {
            loading.value = false;
            return;
        }

        try {
            const { data, message } = await updatePartner(props.id, form);
            feedback.value = {
                title: "Success",
                message: message,
                type: "success",
            };
            emit('closeDialog', true)
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

watch(() => props.id, async (newId) => {
    if (newId) {
        const data = await getPartner(props.id);
        form.name = data.name;
        form.nik = data.nik;
        form.address = data.address;
        form.year = data.year;
    }
}, { immediate: true });

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