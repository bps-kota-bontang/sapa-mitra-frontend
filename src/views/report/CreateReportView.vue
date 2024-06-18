<template>
  <el-tabs type="border-card">
    <el-tab-pane  lazy label="Satu Mitra Banyak Output"
      ><FormReportByPartner />
    </el-tab-pane>
    <el-tab-pane lazy  label="Satu Output Banyak Mitra"
      ><FormReportByActivity
    /></el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import FormReportByPartner from "@/components/report/FormReportByPartner.vue";
import FormReportByActivity from "@/components/report/FormReportByActivity.vue";
</script>
