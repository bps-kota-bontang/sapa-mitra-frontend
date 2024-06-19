import ListOutputView from '@/views/output/ListOutputView.vue';
import AddOutputView from '@/views/output/AddOutputView.vue';

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
            },
            {
                path: 'tambah',
                name: 'addOutput',
                component: AddOutputView,
            }
        ]
    }
];

export default outputRoutes;