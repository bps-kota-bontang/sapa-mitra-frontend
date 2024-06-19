import ListActivityView from '@/views/activity/ListActivityView.vue';
import AddActivityView from '@/views/activity/AddActivityView.vue';
import { useUserStore } from '@/stores/user';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const activityRoutes = [
    {
        path: '/kegiatan',
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        },
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
            const user = useUserStore();
            if (!["TU"].includes(user.team)) next({ "name": "unauthorized" })
            else next();
        },
        children: [
            {
                path: '',
                name: 'listActivity',
                component: ListActivityView
            },
            {
                path: 'tambah',
                name: 'addActivity',
                component: AddActivityView
            }
        ]
    },

];

export default activityRoutes;