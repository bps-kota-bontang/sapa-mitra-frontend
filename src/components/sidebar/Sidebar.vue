<template>
  <div shadow="never" style="border-radius: 10px; margin: 20px">
    <div style="  display: flex; align-items: center; gap:10px;  ">
      <IconBPS style="width: 48px; height: 48px;" />
      <el-text tag="b" size="large">{{ app }}</el-text>
    </div>
  </div>
  <el-menu style="border-right: none" :router="true" :default-active="$route.path">
    <el-menu-item index="/"><el-icon>
        <House />
      </el-icon>Dasbor</el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>SPK
      </template>
      <el-menu-item index="/spk">Daftar SPK</el-menu-item>
      <el-menu-item v-if="['ANGGOTA'].includes(user.position) || ['TU'].includes(user.team)" index="/spk/buat">Buat
        SPK</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <DocumentCopy />
        </el-icon>BAST
      </template>
      <el-menu-item index="/bast">Daftar BAST</el-menu-item>
      <el-menu-item v-if="!['KEPALA'].includes(user.position)" index="/bast/buat">Buat BAST</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <Guide />
        </el-icon>Kegiatan
      </template>
      <el-menu-item index="/kegiatan">Daftar Kegiatan</el-menu-item>
      <el-menu-item index="/kegiatan/tambah" v-if="['TU'].includes(user.team)">Tambah
        Kegiatan</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <el-icon>
          <Memo />
        </el-icon>Output
      </template>
      <el-menu-item index="/output">Daftar Output</el-menu-item>
      <el-menu-item index="/output/tambah">Tambah Output</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="5" v-if="['TU', 'IPDS'].includes(user.team)">
      <template #title>
        <el-icon>
          <User />
        </el-icon>Mitra
      </template>
      <el-menu-item index="/mitra">Daftar Mitra</el-menu-item>
      <el-menu-item index="/mitra/tambah">Tambah Mitra</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/pengguna" v-if="['TU', 'IPDS'].includes(user.team)"><el-icon>
        <User />
      </el-icon>Pengguna</el-menu-item>
    <el-menu-item index="/konfigurasi" v-if="['TU'].includes(user.team)">
      <el-icon>
        <Setting />
      </el-icon>Konfigurasi
    </el-menu-item>
    <el-sub-menu index="6">
      <template #title>
        <el-icon>
          <VideoPlay />
        </el-icon>Tutorial
      </template>
      <el-menu-item>
        <a href="http://s.bps.go.id/Tutorial-Entri-SPK-SAPAMITRA" target="_blank">Tutorial Entri SPK</a>
      </el-menu-item>
      <el-menu-item>
        <a href="http://s.bps.go.id/Tutorial-Entri-BAST-SAPAMITRA" target="_blank">Tutorial Entri BAST</a>
      </el-menu-item>
      <el-menu-item>
        <a href="http://s.bps.go.id/Tutorial-Verifikasi-SPK-SAPAMITRA" target="_blank">Tutorial Verifikasi SPK</a>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="7">
      <template #title>
        <el-icon>
          <Service />
        </el-icon>SOP
      </template>
      <el-menu-item>
        <a href="http://s.bps.go.id/SOP-SPK-SAPAMITRA" target="_blank">SOP entri SPK</a>
      </el-menu-item>
      <el-menu-item>
        <a href="http://s.bps.go.id/SOP-BAST-SAPAMITRA" target="_blank">SOP entri BAST</a>
      </el-menu-item>
    </el-sub-menu>
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
  VideoPlay,
  Service
} from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
const app = import.meta.env.VITE_APP_TITLE;
const user = useUserStore();
</script>

<style>
.el-menu-item a {
  text-decoration: none;
  color: inherit;
}
</style>
