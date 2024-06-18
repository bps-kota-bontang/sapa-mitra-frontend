import ListPartnerView from '@/views/partner/ListPartnerView.vue';
import AddPartnerView from '@/views/partner/AddPartnerView.vue';

const partnerRoutes = [
    {
        path: '/mitra',
        name: 'listPartner',
        component: ListPartnerView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    },
    {
        path: '/mitra/tambah',
        name: 'addPartner',
        component: AddPartnerView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    }
];

export default partnerRoutes;