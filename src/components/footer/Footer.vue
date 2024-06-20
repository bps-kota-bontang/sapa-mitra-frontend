<template>
  <div>
    <el-text
      >© 2024. Made with ❤️ by BPS Kota Bontang. (Versi: 1.0.0
      {{ mode }})</el-text
    >
  </div>
</template>

<script setup>
const mode = import.meta.env.MODE;
</script>
