<template>
    <el-dialog v-model="props.isShow" title="Ubah Output" width="500" :before-close="handleClose">
        <el-form :model="form" ref="formRef" label-width="auto" label-position="top" :rules="rules" v-loading="loading">
            <el-form-item required prop="activity.activityId" label="Nama Kegiatan">
                <el-select v-model="form.activity.activityId" placeholder="Pilih Nama Kegiatan" clearable filterable>
                    <el-option v-for="activity in activities" :key="activity._id" :label="activity.name"
                        :value="activity._id" />
                </el-select>
            </el-form-item>
            <el-form-item required label="Nama Output" prop="name">
                <el-input v-model="form.name" placeholder="Masukkan Nama Output" />
            </el-form-item>
            <el-form-item required label="Satuan Output" prop="unit">
                <el-input v-model="form.unit" placeholder="Masukkan Satuan Output" />
            </el-form-item>
            <el-form-item required label="Tahun Kegiatan" prop="year">
                <el-input v-model="form.year" placeholder="Masukkan Tahun Output" />
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
import { ref, reactive, watch, onMounted } from "vue";
import { getOutput, updateOutput } from "@/api/outputApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { getActivities } from "@/api/activityApi";

const initialState = {
    activity: {
        activityId: "",
    },
    name: "",
    unit: "",
    year: "",
};

const rules = reactive<FormRules<any>>({
    "activity.activityId": [
        {
            required: true,
            message: 'Nama kegiatan perlu terisi',
            trigger: 'change',
        }
    ],
    name: [
        {
            required: true,
            message: "Nama Output perlu terisi",
            trigger: "blur",
        },
    ],
    unit: [
        {
            required: true,
            message: "Satuan Output perlu terisi",
            trigger: "blur",
        },
    ],
    year: [
        {
            required: true,
            message: "Tahun Output perlu terisi",
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
const activities = ref<any[]>([]);

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
            const { data, message } = await updateOutput(props.id, form);
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
        const data = await getOutput(props.id);
        form.activity.activityId = data.activity._id;
        form.name = data.name;
        form.unit = data.unit;
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
onMounted(async () => {
    activities.value = await getActivities();
});

</script>