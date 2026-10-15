import { useUserStore } from '@/stores/user';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const onlyManager = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const user = useUserStore();
    if (!["TU", "IPDS"].includes(user.team)) next({ "name": "unauthorized" })
    else next();
};

const userRoutes = [
    {
        path: '/pengguna/tambah',
        name: 'addUser',
        component: () => import('@/views/user/AddUserView.vue'),
        meta: {
            title: "Tambah Pengguna",
            layout: 'LayoutDashboard',
            requiresAuth: true
        },
        beforeEnter: onlyManager,
    },
    {
        path: '/pengguna',
        name: 'listUser',
        component: () => import('@/views/user/ListUserView.vue'),
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