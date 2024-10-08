import { useUserStore } from '@/stores/user';
import ListUserView from '@/views/user/ListUserView.vue';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const userRoutes = [
    {
        path: '/pengguna',
        name: 'listUser',
        component: ListUserView,
        meta: {
            title: "Daftar Pengguna",
            layout: 'LayoutDashboard',
            requiresAuth: true
        },
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
            const user = useUserStore();
            if (!["TU", "IPDS"].includes(user.team)) next({ "name": "unauthorized" })
            else next();
        },
    }
];

export default userRoutes;