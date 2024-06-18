import ListContractView from '@/views/contract/ListContractView.vue';
import CreateContractView from '@/views/contract/CreateContractView.vue';

const contractRoutes = [
    {
        path: '/spk',
        name: 'listContract',
        component: ListContractView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    },
    {
        path: '/spk/buat',
        name: 'createContract',
        component: CreateContractView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    }
];

export default contractRoutes;