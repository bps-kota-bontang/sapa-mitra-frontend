<template>
    <el-dialog v-model="props.isShow" title="Ubah Kontrak" width="500" :before-close="handleClose">
        <el-form :model="form" ref="formRef" label-width="auto" label-position="top" :rules="rules" v-loading="loading">
            <el-form-item required label="No SPK" :rules="{
                required: true,
                message: 'Nomor SPK perlu terisi',
                trigger: 'blur',
            }">
                <el-input v-model="form.number" placeholder="Masukkan No SPK" />
            </el-form-item>
            <el-form-item required label="Grand Total" :rules="{
                required: true,
                message: 'Grand Total perlu terisi',
                trigger: 'blur',
            }">
                <el-input v-model="form.grandTotal" :formatter="formatNumber" :parser="formatParserNumber"
                    placeholder="Masukkan Grand Total" />
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
import { getContract, updateContract } from "@/api/contractApi";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { formatParserNumber, formatNumber } from "@/utils/currency";

const initialState = {
    number: "",
    grandTotal: ""
};

const rules = reactive<FormRules<any>>({
    number: [
        {
            required: true,
            message: 'No SPK perlu terisi',
            trigger: 'blur',
        },
    ],
    grandTotal: [
        {
            required: true,
            message: 'Grand Total perlu terisi',
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
            const { data, message } = await updateContract(props.contractId, form);
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
        const data = await getContract(props.contractId);
        form.number = data.number
        form.grandTotal = data.grandTotal
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