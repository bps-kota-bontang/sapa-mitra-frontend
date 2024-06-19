import { createRouter, createWebHistory } from 'vue-router'

import authRoutes from '@/router/authRoute'
import contractRoutes from '@/router/contractRoute'
import reportRoutes from '@/router/reportRoute'
import activityRoutes from '@/router/activityRoute'
import outputRoutes from '@/router/outputRoute'
import partnerRoutes from '@/router/partnerRoute'
import userRoutes from '@/router/userRoute'
import ConfigurationView from '@/views/ConfigurationView.vue';
import DashboardView from '@/views/DashboardView.vue'
import LandingView from '@/views/LandingView.vue';
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dasbor',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        layout: 'LayoutDashboard',
        requiresAuth: true
      }
    },
    {
      path: '/konfigurasi',
      name: 'configuration',
      component: ConfigurationView,
      meta: {
        layout: 'LayoutDashboard',
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    ...authRoutes,
    ...contractRoutes,
    ...reportRoutes,
    ...activityRoutes,
    ...outputRoutes,
    ...partnerRoutes,
    ...userRoutes,
  ]
})





router.beforeEach((to, from, next) => {
  const user = useUserStore();
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!user.isLogin) {
      next({ name: 'login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    if (to.name == "login") {
      if (user.isLogin) {
        next({ name: 'dashboard' })
      } else {
        next();
      }
    } else {
      next() // does not require auth, make sure to always call next()!
    }

  }
})

export default router
