import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useUserStore } from "@/stores/user";
import CreateRecapView from "@/views/recap/CreateRecapView.vue";

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
        component: CreateRecapView,
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
