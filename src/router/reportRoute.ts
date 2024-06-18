import ListReportView from '@/views/report/ListReportView.vue';
import CreateReportView from '@/views/report/CreateReportView.vue';

const reportRoutes = [
    {
        path: '/bast',
        name: 'listReport',
        component: ListReportView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    },
    {
        path: '/bast/buat',
        name: 'createReport',
        component: CreateReportView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    }
];

export default reportRoutes;