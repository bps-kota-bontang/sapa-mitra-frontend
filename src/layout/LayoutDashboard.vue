<template>
  <el-container class="layout-container">
    <el-aside
      :class="{ 'is-mobile': isMobile, 'is-collapsed': sidebarCollapsed }"
      :width="sidebarWidth"
    >
      <Sidebar :collapsed="sidebarCollapsed"></Sidebar>
    </el-aside>
    <div v-if="isMobile && !sidebarCollapsed" class="sidebar-backdrop" @click="closeSidebar"></div>
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
import { computed, onMounted, onUnmounted, ref } from "vue";

const isMobile = ref(typeof window !== "undefined" && window.innerWidth <= 768);
const sidebarCollapsed = ref(isMobile.value);
const sidebarWidth = computed(() => {
  if (isMobile.value) return sidebarCollapsed.value ? "0px" : "250px";
  return sidebarCollapsed.value ? "64px" : "250px";
});

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const closeSidebar = () => {
  sidebarCollapsed.value = true;
};

const handleResize = () => {
  const mobile = window.innerWidth <= 768;
  if (mobile !== isMobile.value) {
    isMobile.value = mobile;
    sidebarCollapsed.value = mobile;
  }
};

onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));
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
  overflow-x: hidden;
  z-index: 5;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: rgb(0 0 0 / 30%);
}

.layout-container .el-main {
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  margin: 20px;
  position: relative;
}

@media (max-width: 768px) {
  .layout-container .el-aside {
    position: fixed;
    inset: 0 auto 0 0;
    height: 100vh;
    overflow-y: auto;
    box-shadow: 4px 0 16px rgb(0 0 0 / 12%);
  }

  .layout-container .el-container {
    min-width: 0;
  }

  .layout-container .el-main {
    margin: 12px;
    padding: 12px;
  }

  .layout-container .el-footer {
    margin-left: 12px;
    margin-right: 12px;
  }
}

</style>
