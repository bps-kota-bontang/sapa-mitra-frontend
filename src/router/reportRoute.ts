import ListReportView from "@/views/report/ListReportView.vue";
import CreateReportView from "@/views/report/CreateReportView.vue";
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
        component: ListReportView,
        meta: {
          title: "Daftar BAST",
        },
      },
      {
        path: "buat",
        name: "createReport",
        component: CreateReportView,
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
