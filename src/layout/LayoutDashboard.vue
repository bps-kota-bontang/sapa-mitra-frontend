<template>
  <el-container class="layout-container">
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
.layout-container {
  height: 100vh;
}
.layout-container .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container .el-aside {
  color: var(--el-text-color-primary);

  /* background: var(--el-color-primary-light-8); */
}
.layout-container .el-menu {
  border-right: none;
}
.layout-container .el-main {
  padding: 0;
  margin: 20px;
}
.layout-container .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
