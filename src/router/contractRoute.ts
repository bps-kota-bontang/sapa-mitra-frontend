import ListContractView from '@/views/contract/ListContractView.vue';
import CreateContractView from '@/views/contract/CreateContractView.vue';
import { useUserStore } from '@/stores/user';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const contractRoutes = [
    {
        path: '/spk',
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        },
        children: [
            {
                path: '',
                name: 'listContract',
                component: ListContractView,
                meta: {
                    title: "Daftar SPK"
                }
            },
            {
                path: 'buat',
                name: 'createContract',
                component: CreateContractView,
                meta: {
                    title: "Buat SPK"
                },
                beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
                    const user = useUserStore();
                    if (!["ANGGOTA"].includes(user.position)) next({ "name": "unauthorized" })
                    else next();
                },
            }
        ]
    },
];

export default contractRoutes;