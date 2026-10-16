const skRoutes = [
  {
    path: "/sk",
    name: "skList",
    component: () => import("@/views/sk/ListSKView.vue"),
    meta: { title: "Surat Keputusan", layout: "LayoutDashboard", requiresAuth: true },
  },
];

export default skRoutes;
