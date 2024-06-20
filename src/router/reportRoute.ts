import ListReportView from '@/views/report/ListReportView.vue';
import CreateReportView from '@/views/report/CreateReportView.vue';

const reportRoutes = [
    {
        path: '/bast',
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        },
        children: [
            {
                path: '',
                name: 'listReport',
                component: ListReportView,
                meta: {
                    title: "Daftar BAST"
                }
            },
            {
                path: 'buat',
                name: 'createReport',
                component: CreateReportView,
                meta: {
                    title: "Buat BAST"
                }
            }
        ]
    }
];

export default reportRoutes;