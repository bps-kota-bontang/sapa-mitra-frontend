<template>
  <el-image
    id="icon"
    src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"
    fit="cover"
  />
  <el-menu
    style="border-right: none"
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
      <el-menu-item v-if="['ANGGOTA'].includes(user.position)" index="/spk/buat">Buat SPK</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><DocumentCopy /></el-icon>BAST
      </template>
      <el-menu-item index="/bast">Daftar BAST</el-menu-item>
      <el-menu-item index="/bast/buat">Buat BAST</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3" v-if="['TU'].includes(user.team)">
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
    <el-sub-menu index="5" v-if="['TU', 'IPDS'].includes(user.team)">
      <template #title>
        <el-icon><User /></el-icon>Mitra
      </template>
      <el-menu-item index="/mitra">Daftar Mitra</el-menu-item>
      <el-menu-item index="/mitra/tambah">Tambah Mitra</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/pengguna" v-if="['TU'].includes(user.team)"
      ><el-icon><User /></el-icon>Pengguna</el-menu-item
    >
    <el-menu-item index="/konfigurasi" v-if="['TU'].includes(user.team)"
      ><el-icon><Setting /></el-icon>Konfigurasi</el-menu-item
    >
  </el-menu>
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
import { useUserStore } from "@/stores/user";

const user = useUserStore();
</script>

<style></style>
