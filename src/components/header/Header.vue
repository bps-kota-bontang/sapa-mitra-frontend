<template>
  <div class="toolbar">
    <div style="display: flex; align-items: center">
      <el-dropdown size="large" @command="handleCommand">
        <el-avatar
          :size="40"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">Logout</el-dropdown-item>
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

const user = useUserStore();

const handleCommand = (command: string | number | object) => {
  if (command == "logout") user.logout();
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
