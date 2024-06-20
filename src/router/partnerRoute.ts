import ListPartnerView from '@/views/partner/ListPartnerView.vue';
import AddPartnerView from '@/views/partner/AddPartnerView.vue';
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
                component: ListPartnerView,
                meta: {
                    title: "Daftar Mitra"
                }

            },
            {
                path: 'tambah',
                name: 'addPartner',
                component: AddPartnerView,
                meta: {
                    title: "Tambah Mitra"
                }
            }
        ]
    }
];

export default partnerRoutes;