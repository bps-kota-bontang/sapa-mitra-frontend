import LoginView from '@/views/LoginView.vue';

const authRoutes = [
    {
        path: '/masuk',
        name: 'login',
        component: LoginView,
        meta: {
            title: "Masuk",
        }
    },
];

export default authRoutes;