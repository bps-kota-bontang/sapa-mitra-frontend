import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "@/router/authRoute";
import contractRoutes from "@/router/contractRoute";
import reportRoutes from "@/router/reportRoute";
import activityRoutes from "@/router/activityRoute";
import outputRoutes from "@/router/outputRoute";
import partnerRoutes from "@/router/partnerRoute";
import userRoutes from "@/router/userRoute";
import errorHandlingRoutes from "@/router/errorHandlingRoute";
import ConfigurationView from "@/views/ConfigurationView.vue";
import DashboardView from "@/views/DashboardView.vue";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";
import SettingView from "@/views/setting/SettingView.vue";
import LockView from "@/views/LockView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      name: "dashboard",
      component: DashboardView,
      meta: {
        title: "Dasbor",
        layout: "LayoutDashboard",
        requiresAuth: true,
      },
    },
    {
      path: "/konfigurasi",
      name: "configuration",
      component: ConfigurationView,
      meta: {
        title: "Konfigurasi",
        layout: "LayoutDashboard",
        requiresAuth: true,
      },
      beforeEnter: (to, from, next) => {
        const user = useUserStore();
        if (!["TU"].includes(user.team)) next({ name: "unauthorized" });
        else next();
      },
    },
    {
      path: "/kunci",
      name: "lock",
      component: LockView,
      meta: {
        title: "Kunci",
        layout: "LayoutDashboard",
        requiresAuth: true,
      },
      beforeEnter: (to, from, next) => {
        const user = useUserStore();
        if (!["TU"].includes(user.team)) next({ name: "unauthorized" });
        else next();
      },
    },
    {
      path: "/pengaturan",
      name: "setting",
      component: SettingView,
      meta: {
        title: "Pengaturan",
        layout: "LayoutDashboard",
        requiresAuth: true,
      },
    },
    ...authRoutes,
    ...contractRoutes,
    ...reportRoutes,
    ...activityRoutes,
    ...outputRoutes,
    ...partnerRoutes,
    ...userRoutes,
    ...errorHandlingRoutes,
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!auth.isLogin) {
      next({ name: "login" });
    } else {
      const user = useUserStore();
      await user.fetchProfile();
      next();
    }
  } else {
    if (to.name == "login") {
      if (auth.isLogin) {
        next({ name: "dashboard" });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

router.afterEach((to, form) => {
  const title: string = to.meta.title as string;
  const app = import.meta.env.VITE_APP_TITLE;
  document.title = `${app} - ${title}`;
});

export default router;
