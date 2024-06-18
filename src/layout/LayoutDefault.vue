<template>
  <div class="layout-container">
    <el-container>
      <el-main> <RouterView /></el-main>
    </el-container>
  </div>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-container .el-main {
  padding: 0;
  margin: 0px;
}
</style>
