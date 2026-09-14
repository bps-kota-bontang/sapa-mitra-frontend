<template>
  <div class="sidebar-brand" :class="{ collapsed }">
    <div style="  display: flex; align-items: center; gap:10px;  ">
      <IconBPS style="width: 48px; height: 48px;" />
      <el-text v-if="!collapsed" tag="b" size="large">{{ app }}</el-text>
    </div>
  </div>
  <el-menu style="border-right: none" :router="true" :default-active="$route.path" :collapse="collapsed">
    <el-menu-item index="/"><el-icon>
        <House />
      </el-icon><span>Dasbor</span></el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Document />
        </el-icon><span>SPK</span>
      </template>
      <el-menu-item index="/spk">Daftar SPK</el-menu-item>
      <el-menu-item v-if="['ANGGOTA'].includes(user.position) || ['TU'].includes(user.team)" index="/spk/buat">Buat
        SPK</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <DocumentCopy />
        </el-icon><span>BAST</span>
      </template>
      <el-menu-item index="/bast">Daftar BAST</el-menu-item>
      <el-menu-item v-if="!['KEPALA'].includes(user.position)" index="/bast/buat">Buat BAST</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/pelatihan" v-if="['TU'].includes(user.team)">
      <el-icon>
        <Money />
      </el-icon><span>Biaya Pelatihan</span>
    </el-menu-item>
    <el-menu-item index="/rekapitulasi">
      <el-icon>
        <CircleCheck />
      </el-icon><span>Rekapitulasi</span>
    </el-menu-item>
    <el-sub-menu index="4">
      <template #title>
        <el-icon>
          <Guide />
        </el-icon><span>Kegiatan</span>
      </template>
      <el-menu-item index="/kegiatan">Daftar Kegiatan</el-menu-item>
      <el-menu-item index="/kegiatan/tambah">Tambah
        Kegiatan</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>
        <el-icon>
          <Memo />
        </el-icon><span>Output</span>
      </template>
      <el-menu-item index="/output">Daftar Output</el-menu-item>
      <el-menu-item index="/output/tambah">Tambah Output</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="6">
      <template #title>
        <el-icon>
          <User />
        </el-icon><span>Mitra</span>
      </template>
      <el-menu-item index="/mitra">Daftar Mitra</el-menu-item>
      <el-menu-item index="/mitra/tambah" v-if="['TU', 'IPDS'].includes(user.team)">Tambah Mitra</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/kunci" v-if="['TU'].includes(user.team)">
      <el-icon>
        <Key />
      </el-icon><span>Kunci</span>
    </el-menu-item>
    <el-menu-item index="/pengguna" v-if="['TU', 'IPDS'].includes(user.team)"><el-icon>
        <User />
      </el-icon><span>Pengguna</span></el-menu-item>
    <el-menu-item index="/konfigurasi" v-if="['TU'].includes(user.team)">
      <el-icon>
        <Setting />
      </el-icon><span>Konfigurasi</span>
    </el-menu-item>
    <el-sub-menu index="7">
      <template #title>
        <el-icon>
          <VideoPlay />
        </el-icon><span>Tutorial</span>
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
    <el-sub-menu index="8">
      <template #title>
        <el-icon>
          <Service />
        </el-icon><span>SOP</span>
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
  Service,
  Key,
  Money,
  CircleCheck
} from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
defineProps<{ collapsed: boolean }>();
const app = import.meta.env.VITE_APP_TITLE;
const user = useUserStore();
</script>

<style>
.sidebar-brand {
  border-radius: 10px;
  margin: 20px;
}

.sidebar-brand.collapsed {
  margin: 20px 8px;
}

.el-menu--collapse .el-menu-item > span,
.el-menu--collapse .el-sub-menu__title > span,
.el-menu--collapse .el-sub-menu__icon-arrow {
  display: none;
}

.el-menu-item a {
  text-decoration: none;
  color: inherit;
}
</style>
