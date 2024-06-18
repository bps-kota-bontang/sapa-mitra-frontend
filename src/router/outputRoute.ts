import ListOutputView from '@/views/output/ListOutputView.vue';
import AddOutputView from '@/views/output/AddOutputView.vue';

const outputRoutes = [
    {
        path: '/output',
        name: 'listOutput',
        component: ListOutputView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    },
    {
        path: '/output/tambah',
        name: 'addOutput',
        component: AddOutputView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    }
];

export default outputRoutes;