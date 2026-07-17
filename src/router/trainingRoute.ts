import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useUserStore } from "@/stores/user";

const trainingRoutes = [
  {
    path: "/pelatihan",
    meta: {
      layout: "LayoutDashboard",
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "createTraining",
        component: () => import("@/views/training/CreateTrainingView.vue"),
        meta: {
          title: "Buat Biaya Pelatihan",
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

export default trainingRoutes;
