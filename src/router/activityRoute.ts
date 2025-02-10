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
        beforeEnter: (
          to: RouteLocationNormalized,
          from: RouteLocationNormalized,
          next: NavigationGuardNext
        ) => {
          const user = useUserStore();
          if (!["TU"].includes(user.team)) next({ name: "unauthorized" });
          else next();
        },
      },
    ],
  },
];

export default activityRoutes;
