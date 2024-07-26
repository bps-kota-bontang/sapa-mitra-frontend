<template>
    <el-descriptions title="" :column="1" border>
        <el-descriptions-item label="Nama">{{ user.name }}</el-descriptions-item>
        <el-descriptions-item label="NIP">{{ user.nip }}</el-descriptions-item>
        <el-descriptions-item label="Email">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="Tim"><el-tag size="small">{{ user.team }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="Posisi">{{ user.position }}</el-descriptions-item>
    </el-descriptions>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
const user = useUserStore();
</script>