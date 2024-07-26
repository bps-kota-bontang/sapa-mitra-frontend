<template>
    <el-tabs type="border-card">
        <el-tab-pane lazy label="Profil">
            <ProfileUser />
        </el-tab-pane>
        <el-tab-pane lazy label="Ubah Kata Sandi">
            <FormChangePassword />
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>

import FormChangePassword from "@/components/setting/FormChangePassword.vue";
import ProfileUser from "@/components/setting/ProfileUser.vue";
</script>