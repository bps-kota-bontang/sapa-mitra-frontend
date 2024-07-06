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