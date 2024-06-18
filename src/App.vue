<script setup lang="ts">
import LayoutDashboard from "@/layout/LayoutDashboard.vue";
import LayoutDefault from "@/layout/LayoutDefault.vue";
</script>

<template>
  <LayoutDashboard v-if="$route.meta.layout">
    <router-view class="content" />
  </LayoutDashboard>
  <LayoutDefault v-else>
    <router-view class="content" />
  </LayoutDefault>
</template>
