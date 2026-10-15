<template>
  <el-breadcrumb separator="/" class="app-breadcrumb">
    <el-breadcrumb-item v-for="(crumb, index) in crumbs" :key="crumb.path"
      :to="index < crumbs.length - 1 ? crumb.path : undefined">
      {{ crumb.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

type Crumb = { path: string; title: string };

const route = useRoute();
const router = useRouter();

const titleOf = (path: string) => {
  const resolved = router.resolve(path);

  if (resolved.name === "notFound") return null;

  return (resolved.meta.title as string | undefined) ?? null;
};

const crumbs = computed<Crumb[]>(() => {
  const list: Crumb[] = [];
  const dashboard = titleOf("/");

  if (dashboard) list.push({ path: "/", title: dashboard });

  let path = "";

  for (const segment of route.path.split("/").filter(Boolean)) {
    path += `/${segment}`;
    const title = titleOf(path);

    if (title && list[list.length - 1]?.title !== title) {
      list.push({ path, title });
    }
  }

  // Rute dinamis (mis. /:id) tidak ada di loop; pastikan halaman aktif tetap tampil.
  const current = route.meta.title as string | undefined;
  if (current && list[list.length - 1]?.title !== current) {
    list.push({ path: route.path, title: current });
  }

  return list;
});
</script>

<style scoped>
.app-breadcrumb {
  margin-left: 12px;
}
</style>
