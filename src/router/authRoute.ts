const authRoutes = [
    {
        path: '/masuk',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
            title: "Masuk",
        }
    },
];

export default authRoutes;