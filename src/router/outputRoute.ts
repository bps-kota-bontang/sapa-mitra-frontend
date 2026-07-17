import { useUserStore } from '@/stores/user';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const outputRoutes = [
    {
        path: '/output',
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        },
        children: [
            {
                path: '',
                name: 'listOutput',
                component: () => import('@/views/output/ListOutputView.vue'),
                meta: {
                    title: "Daftar Output"
                }
            },
            {
                path: 'tambah',
                name: 'addOutput',
                component: () => import('@/views/output/AddOutputView.vue'),
                meta: {
                    title: "Tambah Output"
                }
            }

        ]
    }
];

export default outputRoutes;