<template>
  <el-container class="layout-container">
    <el-aside :width="sidebarCollapsed ? '64px' : '250px'">
      <Sidebar :collapsed="sidebarCollapsed"></Sidebar>
    </el-aside>
    <el-container>
      <el-header height="80px">
        <Header :sidebar-collapsed="sidebarCollapsed" @toggle-sidebar="toggleSidebar"></Header>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const sidebarCollapsed = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: #f4f6fa;
}

.layout-container .el-header {
  background-color: var(--el-color-primary-light-7);
}

.layout-container .el-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.layout-container .el-aside {
  color: var(--el-text-color-primary);
  background: white;
  transition: width 0.2s ease;
}

.layout-container .el-main {
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  margin: 20px;
  position: relative;
}

</style>
