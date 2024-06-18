<template>
  <el-scrollbar>
    <el-image id="icon" :src="url" :fit="fit" />

    <el-menu
      :default-openeds="['1', '2', '3', '4', '5', '6', '7']"
      :router="true"
      :default-active="$route.path"
    >
      <el-menu-item index="/dasbor"
        ><el-icon><House /></el-icon>Dasbor</el-menu-item
      >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Document /></el-icon>SPK
        </template>
        <el-menu-item index="/spk">Daftar SPK</el-menu-item>
        <el-menu-item index="/spk/buat">Buat SPK</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><DocumentCopy /></el-icon>BAST
        </template>
        <el-menu-item index="/bast">Daftar BAST</el-menu-item>
        <el-menu-item index="/bast/buat">Buat BAST</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><Guide /></el-icon>Kegiatan
        </template>
        <el-menu-item index="/kegiatan">Daftar Kegiatan</el-menu-item>
        <el-menu-item index="/kegiatan/tambah">Tambah Kegiatan</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4">
        <template #title>
          <el-icon><Memo /></el-icon>Output
        </template>
        <el-menu-item index="/output">Daftar Ouput</el-menu-item>
        <el-menu-item index="/output/tambah">Tambah Output</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="5">
        <template #title>
          <el-icon><User /></el-icon>Mitra
        </template>
        <el-menu-item index="/mitra">Daftar Mitra</el-menu-item>
        <el-menu-item index="/mitra/tambah">Tambah Mitra</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/pengguna"
        ><el-icon><User /></el-icon>Pengguna</el-menu-item
      >
      <el-menu-item index="/konfigurasi"
        ><el-icon><Setting /></el-icon>Konfigurasi</el-menu-item
      >
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {
  House,
  DocumentCopy,
  Document,
  Guide,
  Memo,
  User,
  Setting,
} from "@element-plus/icons-vue";

const fit = "cover";

const url =
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg";
</script>

<style></style>
