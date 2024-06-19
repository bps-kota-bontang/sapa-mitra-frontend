import UnauthorizedView from '@/views/UnauthorizedView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const errorHandlingRoutes = [
    {
        path: '/tidak-diizinkan',
        name: 'unauthorized',
        component: UnauthorizedView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: NotFoundView
    },
];

export default errorHandlingRoutes;