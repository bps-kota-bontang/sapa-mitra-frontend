<template>
  <el-container class="layout-container-demo">
    <el-aside><Sidebar></Sidebar></el-aside>
    <el-container>
      <el-header style="text-align: right" height="80px"
        ><Header></Header
      ></el-header>
      <el-main>
        <el-scrollbar><RouterView /></el-scrollbar
      ></el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container-demo {
  height: 100vh;
}
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);

  /* background: var(--el-color-primary-light-8); */
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
  margin: 20px;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
