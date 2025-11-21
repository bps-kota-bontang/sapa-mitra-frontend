import ListActivityView from "@/views/activity/ListActivityView.vue";
import AddActivityView from "@/views/activity/AddActivityView.vue";
import { useUserStore } from "@/stores/user";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const activityRoutes = [
  {
    path: "/kegiatan",
    meta: {
      layout: "LayoutDashboard",
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "listActivity",
        component: ListActivityView,
        meta: {
          title: "Daftar Kegiatan",
        },
      },
      {
        path: "tambah",
        name: "addActivity",
        component: AddActivityView,
        meta: {
          title: "Tambah Kegiatan",
        },
      },
    ],
  },
];

export default activityRoutes;
