import ListUserView from '@/views/user/ListUserView.vue';

const userRoutes = [
    {
        path: '/pengguna',
        name: 'listUser',
        component: ListUserView,
        meta: {
            layout: 'LayoutDashboard',
            requiresAuth: true
        }
    }
];

export default userRoutes;