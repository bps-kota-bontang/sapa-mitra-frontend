import UnauthorizedView from '@/views/UnauthorizedView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const errorHandlingRoutes = [
    {
        path: '/tidak-diizinkan',
        name: 'unauthorized',
        component: UnauthorizedView,
        meta: {
            title: "Tidak ada akses",
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: NotFoundView,
        meta: {
            title: "Halaman tidak ditemukan"
        }
    },
];

export default errorHandlingRoutes;