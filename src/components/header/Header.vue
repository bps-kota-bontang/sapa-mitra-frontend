<template>
  <div class="toolbar">
    <div style="display: flex; align-items: center">
      <el-dropdown size="large" @command="handleCommand">
        <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon='Setting' command="setting">
              Pengaturan
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="flex-container">
        <span style="font-size: 16px; font-weight: 500">{{ user.name }}</span>
        <span style="font-size: 12px">{{ user.team }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Setting } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const user = useUserStore();
const auth = useAuthStore();
const router = useRouter();

const handleCommand = (command: string | number | object) => {
  if (command == "logout") auth.logout();
  if (command == "setting") router.push({ name: "setting" });
};
</script>

<style>
.flex-container {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.flex-container span {
  display: inline-block;
  text-align: left;
}
</style>
