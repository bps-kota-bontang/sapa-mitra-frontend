<template>
  <el-tabs type="border-card">
    <el-tab-pane lazy label="Satu Mitra Banyak Kegiatan"
      ><FormContractByPartner />
    </el-tab-pane>
    <el-tab-pane lazy label="Satu Kegiatan Banyak Mitra"
      ><FormContractByActivity
    /></el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import FormContractByPartner from "@/components/contract/FormContractByPartner.vue";
import FormContractByActivity from "@/components/contract/FormContractByActivity.vue";
</script>
