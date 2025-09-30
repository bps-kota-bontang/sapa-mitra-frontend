<template>
    <el-dialog v-model="props.isShow" title="Ubah Kegiatan" width="500" :before-close="handleClose" fullscreen>
        <el-form :model="form" ref="formRef" label-width="auto" label-position="top" :rules="rules" v-loading="loading">
            <el-form-item required label="Nama Kegiatan Utama" prop="main">
                <el-input v-model="form.main" placeholder="Masukkan Nama Kegiatan Utama" />
            </el-form-item>
            <el-form-item required label="Nama Kegiatan" prop="name">
                <el-input v-model="form.name" placeholder="Masukkan Nama Kegiatan" />
            </el-form-item>
            <el-form-item required label="Kode Kegiatan" prop="code">
                <el-input v-model="form.code" placeholder="Masukkan Kode Kegiatan" />
            </el-form-item>
            <el-form-item required label="Program" prop="pok.program">
                <el-input v-model="form.pok.program" placeholder="Masukkan Program" />
            </el-form-item>
            <el-form-item required label="Kegiatan" prop="pok.activity">
                <el-input v-model="form.pok.activity" placeholder="Masukkan Kegiatan" />
            </el-form-item>

            <el-form-item required label="KRO" prop="pok.kro">
                <el-input v-model="form.pok.kro" placeholder="Masukkan KRO" />
            </el-form-item>

            <el-form-item required label="RO" prop="pok.ro">
                <el-input v-model="form.pok.ro" placeholder="Masukkan RO" />
            </el-form-item>

            <el-form-item required label="Komponen" prop="pok.component">
                <el-input v-model="form.pok.component" placeholder="Masukkan Komponen" />
            </el-form-item>

            <el-form-item required label="Sub Komponen" prop="pok.subComponent">
                <el-input v-model="form.pok.subComponent" placeholder="Masukkan Sub Komponen" />
            </el-form-item>

            <el-form-item required label="Akun" prop="pok.account">
                <el-input v-model="form.pok.account" placeholder="Masukkan Akun" />
            </el-form-item>


            <el-form-item required label="Satuan" prop="unit">
                <el-input v-model="form.unit" placeholder="Masukkan Satuan Kegiatan" />
            </el-form-item>
            <el-form-item required label="Kategori" prop="category">
                <el-select v-model="form.category" placeholder="Pilih Jenis Kegiatan" clearable filterable>
                    <el-option v-for="category in activityCategories" :key="category.value" :label="category.text"
                        :value="category.value" />
                </el-select>
            </el-form-item>
            <el-form-item required label="Tim" prop="team">
                <el-select v-model="form.team" placeholder="Pilih Nama Tim" clearable filterable>
                    <el-option v-for="team in teams" :key="team.value" :label="team.text" :value="team.value" />
                </el-select>
            </el-form-item>
            <el-form-item required label="Tahun Kegiatan" prop="year">
                <el-input v-model="form.year" placeholder="Masukkan Tahun Kegiatan" />
            </el-form-item>
            <el-form-item label="Khusus">
                <el-switch v-model="form.isSpecial" />
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
import { getActivity, updateActivity } from "@/api/activityApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { activityCategories, teams } from "@/utils/constant";

const initialState = {
    main: "",
    name: "",
    code: "",
    unit: "",
    category: "",
    team: "",
    pok: {
        program: "",
        activity: "",
        kro: "",
        ro: "",
        component: "",
        subComponent: "",
        account: "",
    },
    year: "",
    isSpecial: false
};

const rules = reactive<FormRules<any>>({
    name: [
        {
            required: true,
            message: "Nama kegiatan perlu terisi",
            trigger: "blur",
        },
    ],
    code: [
        {
            required: true,
            message: "Kode kegiatan perlu terisi",
            trigger: "blur",
        },
    ],
    unit: [
        {
            required: true,
            message: "Satuan kegiatan perlu terisi",
            trigger: "blur",
        },
    ],
    category: [
        {
            required: true,
            message: "Kategori kegiatan perlu terisi",
            trigger: "blur",
        },
    ],
    team: [
        {
            required: true,
            message: "Nama tim perlu terisi",
            trigger: "change",
        },
    ],
    year: [
        {
            required: true,
            message: "Tahun perlu terisi",
            trigger: "change",
        },
    ],
    main: [
        {
            required: true,
            message: "Nama kegiatan utama perlu terisi",
            trigger: "blur",
        },
    ],
    "pok.program": [
        {
            required: true,
            message: "Nama program perlu terisi",
            trigger: "blur",
        },
    ],
    "pok.activity": [
        {
            required: true,
            message: "Nama kegiatan perlu terisi",
            trigger: "blur",
        },
    ],
    "pok.kro": [
        {
            required: true,
            message: "KRO perlu terisi",
            trigger: "blur",
        },
    ],
    "pok.ro": [
        {
            required: true,
            message: "RO perlu terisi",
            trigger: "blur",
        },
    ],
    "pok.component": [
        {
            required: true,
            message: "Komponen perlu terisi",
            trigger: "blur",
        },
    ],
    "pok.subComponent": [
        {
            required: true,
            message: "Sub komponen perlu terisi",
            trigger: "blur",
        },
    ],
    "pok.account": [
        {
            required: true,
            message: "Akun perlu terisi",
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
            const { data, message } = await updateActivity(props.id, form);
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
        const data = await getActivity(props.id);
        form.main = data.main;
        form.name = data.name;
        form.code = data.code;
        form.unit = data.unit;
        form.category = data.category;
        form.team = data.team;
        form.year = data.year;
        form.isSpecial = data.isSpecial;
        if (data.pok) {
            form.pok = data.pok;
        }
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