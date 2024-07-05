<template>
    <el-dialog v-model="props.isShow" title="Ubah Kegiatan" width="500" :before-close="handleClose">
        <el-form :model="form" ref="formRef" label-width="auto" label-position="top" :rules="rules" v-loading="loading">
            <el-form-item required label="Nama Kegiatan" prop="name">
                <el-input v-model="form.name" placeholder="Masukkan Nama Kegiatan" />
            </el-form-item>
            <el-form-item required label="Kode Kegiatan" prop="code">
                <el-input v-model="form.code" placeholder="Masukkan Kode Kegiatan" />
            </el-form-item>
            <el-form-item required label="Satuan" prop="unit">
                <el-input v-model="form.unit" placeholder="Masukkan Satuan Kegiatan" />
            </el-form-item>
            <el-form-item required label="Tim" prop="team">
                <el-select v-model="form.team" placeholder="Pilih Nama Tim" clearable filterable>
                    <el-option v-for="team in teams" :key="team.value" :label="team.text" :value="team.value" />
                </el-select>
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
import { teams } from "@/utils/constant";

const initialState = {
    name: "",
    code: "",
    unit: "",
    team: ""
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
    team: [
        {
            required: true,
            message: "Nama tim perlu terisi",
            trigger: "change",
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
        form.name = data.name;
        form.code = data.code;
        form.unit = data.unit;
        form.team = data.team;
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