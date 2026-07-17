import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useUserStore } from "@/stores/user";

const reportRoutes = [
  {
    path: "/bast",
    meta: {
      layout: "LayoutDashboard",
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "listReport",
        component: () => import("@/views/report/ListReportView.vue"),
        meta: {
          title: "Daftar BAST",
        },
      },
      {
        path: "buat",
        name: "createReport",
        component: () => import("@/views/report/CreateReportView.vue"),
        meta: {
          title: "Buat BAST",
        },
        beforeEnter: (
          to: RouteLocationNormalized,
          from: RouteLocationNormalized,
          next: NavigationGuardNext
        ) => {
          const user = useUserStore();
          if (["KEPALA"].includes(user.position)) next({ name: "unauthorized" });
          else next();
        },
      },
    ],
  },
];

export default reportRoutes;
