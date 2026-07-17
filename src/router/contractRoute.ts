import { useUserStore } from "@/stores/user";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const contractRoutes = [
  {
    path: "/spk",
    meta: {
      layout: "LayoutDashboard",
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "listContract",
        component: () => import("@/views/contract/ListContractView.vue"),
        meta: {
          title: "Daftar SPK",
        },
      },
      {
        path: "buat",
        name: "createContract",
        component: () => import("@/views/contract/CreateContractView.vue"),
        meta: {
          title: "Buat SPK",
        },
        beforeEnter: (
          to: RouteLocationNormalized,
          from: RouteLocationNormalized,
          next: NavigationGuardNext
        ) => {
          const user = useUserStore();
          if (
            !["ANGGOTA"].includes(user.position) &&
            !["TU"].includes(user.team)
          )
            next({ name: "unauthorized" });
          else next();
        },
      },
    ],
  },
];

export default contractRoutes;
