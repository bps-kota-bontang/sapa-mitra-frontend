import ListActivityView from '@/views/activity/ListActivityView.vue';
import AddActivityView from '@/views/activity/AddActivityView.vue';

const activityRoutes = [
    {
        path: '/kegiatan',
        name: 'listActivity',
        component: ListActivityView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    },
    {
        path: '/kegiatan/tambah',
        name: 'addActivity',
        component: AddActivityView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    }
];

export default activityRoutes;