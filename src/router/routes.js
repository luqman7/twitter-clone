const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/PageHome.vue"),
        name: "Home"
      },
      {
        path: "/explore",
        component: () => import("src/pages/Explore.vue"),
        name: "Explore"
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
