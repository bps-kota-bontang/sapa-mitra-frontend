<template>
  <div>
    <el-text>© 2024. Made with ❤️ by BPS Kota Bontang. (Versi: 1.0.0
      {{ mode }}, Build: {{ build }})</el-text>
  </div>
</template>

<script setup>
const mode = import.meta.env.MODE;
const build = import.meta.env.VITE_BUILD_HASH;
</script>
