import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useUserStore } from "@/stores/user";

const recapRoutes = [
  {
    path: "/rekapitulasi",
    meta: {
      layout: "LayoutDashboard",
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "createRecap",
        component: () => import("@/views/recap/CreateRecapView.vue"),
        meta: {
          title: "Rekapitulasi",
        },
        beforeEnter: (
          to: RouteLocationNormalized,
          from: RouteLocationNormalized,
          next: NavigationGuardNext
        ) => {
          const user = useUserStore();
          if (["KEPALA"].includes(user.position))
            next({ name: "unauthorized" });
          else next();
        },
      },
    ],
  },
];

export default recapRoutes;
