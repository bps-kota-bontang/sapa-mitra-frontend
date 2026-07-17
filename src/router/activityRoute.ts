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
        component: () => import("@/views/activity/ListActivityView.vue"),
        meta: {
          title: "Daftar Kegiatan",
        },
      },
      {
        path: "tambah",
        name: "addActivity",
        component: () => import("@/views/activity/AddActivityView.vue"),
        meta: {
          title: "Tambah Kegiatan",
        },
      },
    ],
  },
];

export default activityRoutes;
