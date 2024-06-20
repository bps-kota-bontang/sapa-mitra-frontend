<template>
  <div class="container">
    <div
      style="
        width: 480px;
        height: 480px;
        border-radius: 30px;
        justify-content: center;
        align-items: center;
        display: flex;
        text-align: center;
        flex-direction: column;
        background-color: white;
      "
    >
      <NotFound style="width: 200px; height: 200px" />

      <el-text style="font-size: 16pt; font-weight: 500; margin-top: 30px"
        >Halaman tidak ditemukan 😔</el-text
      >
      <el-button @click="homepage" style="margin-top: 20px" type="primary"
        >Pergi ke halaman utama</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const homepage = () => {
  router.push({ name: "dashboard" });
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(
    --el-color-primary-light-5
  ); /* Example background color */
}

.card {
  max-width: 480px;
}
</style>
