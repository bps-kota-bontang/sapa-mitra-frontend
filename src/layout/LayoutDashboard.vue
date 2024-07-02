<template>
  <el-container class="layout-container">
    <el-aside>
      <Sidebar></Sidebar>
    </el-aside>
    <el-container>
      <el-header style="text-align: right" height="80px">
        <Header></Header>
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
  width: 250px
}

.layout-container .el-main {
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  margin: 20px;
  position: relative;
}

.layout-container .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
