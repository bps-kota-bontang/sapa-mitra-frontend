import ListOutputView from '@/views/output/ListOutputView.vue';
import AddOutputView from '@/views/output/AddOutputView.vue';
import { useUserStore } from '@/stores/user';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const outputRoutes = [
    {
        path: '/output',
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        },
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
            const user = useUserStore();
            if (!["TU"].includes(user.team)) next({ "name": "unauthorized" })
            else next();
        },
        children: [
            {
                path: '',
                name: 'listOutput',
                component: ListOutputView,
                meta: {
                    title: "Daftar Output"
                }
            },
            {
                path: 'tambah',
                name: 'addOutput',
                component: AddOutputView,
                meta: {
                    title: "Tambah Output"
                }
            }

        ]
    }
];

export default outputRoutes;