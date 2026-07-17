const errorHandlingRoutes = [
    {
        path: '/tidak-diizinkan',
        name: 'unauthorized',
        component: () => import('@/views/UnauthorizedView.vue'),
        meta: {
            title: "Tidak ada akses",
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () => import('@/views/NotFoundView.vue'),
        meta: {
            title: "Halaman tidak ditemukan"
        }
    },
];

export default errorHandlingRoutes;