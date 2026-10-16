import { useUserStore } from "@/stores/user";

const mainActivityRoutes = [
  {
    path: "/kegiatan-utama",
    name: "mainActivities",
    component: () => import("@/views/activity/MainActivityView.vue"),
    meta: { title: "Kegiatan Utama", layout: "LayoutDashboard", requiresAuth: true },
    beforeEnter: () => Boolean(useUserStore().team) || { name: "unauthorized" },
  },
];

export default mainActivityRoutes;