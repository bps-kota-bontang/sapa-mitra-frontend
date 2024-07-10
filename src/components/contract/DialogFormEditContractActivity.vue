<template>
    <el-dialog v-model="props.isShow" title="Ubah Kegiatan" width="500" :before-close="handleClose">
        <el-form :model="form" ref="formRef" label-width="auto" label-position="top" :rules="rules" v-loading="loading">
            <el-form-item required label="Tanggal Mulai" :rules="{
                required: true,
                message: 'Tanggal mulai perlu terisi',
                trigger: 'change',
            }">
                <el-col>
                    <el-date-picker v-model="form.startDate" :default-value="formatPeriodDate(props.period)" type="date"
                        placeholder="Pilih Tanggal Mulai" />
                </el-col>
            </el-form-item>
            <el-form-item required label="Tanggal Selesai" :rules="{
                required: true,
                message: 'Tanggal selesai perlu terisi',
                trigger: 'change',
            }">
                <el-col>
                    <el-date-picker v-model="form.endDate" type="date" :default-value="formatPeriodDate(props.period)"
                        placeholder="Pilih Tanggal Selesai" />
                </el-col>
            </el-form-item>
            <el-form-item required label="Volume" :rules="{
                required: true,
                message: 'Volume perlu terisi',
                trigger: 'blur',
            }">
                <el-input v-model="form.volume" placeholder="Masukkan Volume" :formatter="formatNumber"
                    :parser="formatParserNumber" />
            </el-form-item>
            <el-form-item required label="Rate" :rules="{
                required: true,
                message: 'Rate perlu terisi',
                trigger: 'blur',
            }">
                <el-input v-model="form.rate" :formatter="formatNumber" :parser="formatParserNumber"
                    placeholder="Masukkan Rate" />
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
import { getContractActivity, updateContractActivity } from "@/api/contractApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { formatPeriodDate } from "@/utils/date";
import { formatParserNumber, formatNumber } from "@/utils/currency";

const initialState = {
    startDate: "",
    endDate: "",
    volume: "",
    rate: ""
};

const rules = reactive<FormRules<any>>({
    startDate: [
        {
            required: true,
            message: 'Tanggal mulai perlu terisi',
            trigger: 'change',
        },
    ],
    endDate: [
        {
            required: true,
            message: 'Tanggal selesai perlu terisi',
            trigger: 'change',
        },
    ],
    volume: [
        {
            required: true,
            message: 'Volume perlu terisi',
            trigger: 'blur',
        },
    ],
    rate: [
        {
            required: true,
            message: 'Rate perlu terisi',
            trigger: 'blur',
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
    contractId: String,
    activityId: String,
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
            const { data, message } = await updateContractActivity(props.contractId, props.activityId, form);
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

watch(() => props.isShow, async (isShow) => {
    if (isShow) {
        const data = await getContractActivity(props.contractId, props.activityId);
        form.startDate = data.startDate
        form.endDate = data.endDate
        form.volume = data.volume
        form.rate = data.rate
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