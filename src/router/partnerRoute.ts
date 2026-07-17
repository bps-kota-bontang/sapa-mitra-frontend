import { useUserStore } from '@/stores/user';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const partnerRoutes = [
    {
        path: '/mitra',
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        },
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
            const user = useUserStore();
            if (!["TU", "IPDS"].includes(user.team)) next({ "name": "unauthorized" })
            else next();
        },
        children: [
            {
                path: '',
                name: 'listPartner',
                component: () => import('@/views/partner/ListPartnerView.vue'),
                meta: {
                    title: "Daftar Mitra"
                }

            },
            {
                path: 'tambah',
                name: 'addPartner',
                component: () => import('@/views/partner/AddPartnerView.vue'),
                meta: {
                    title: "Tambah Mitra"
                }
            }
        ]
    }
];

export default partnerRoutes;