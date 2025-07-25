import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/modules/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/public/HomeView.vue"),
    },
    {
      path: "/survey-presentation",
      name: "SurveyPresentation",
      component: () => import("@/views/public/SurveyPublicView.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/LoginView.vue"),
      meta: {
        requiresGuest: true,
      },
    },

    // Rutas Administrativas (Solo ADMIN)
    {
      path: "/admin",
      redirect: "/dashboard",
    },
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      component: () => import("@/views/admin/DashboardView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin/surveys",
      name: "SurveyList",
      component: () => import("@/views/admin/SurveyListView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin/surveys/create",
      name: "SurveyCreate",
      component: () => import("@/views/admin/SurveyCreateView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin/surveys/:id/edit",
      name: "SurveyEdit",
      component: () => import("@/views/admin/SurveyEditView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin/responses",
      name: "ResponseView",
      component: () => import("@/views/admin/ResponseView.vue"),
      meta: {
        requiresAuth: true,
      },
    },

    // Wildcard route
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      redirect: "/",
    },
  ],
});

// Guard de autenticación y autorización
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // 1. Usuario autenticado tratando de acceder a login
  if (to.meta.requiresGuest && authStore.token) {
    return next("/admin/dashboard");
  }

  // 2. Ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.token) {
    return next("/login");
  }

  // 3. Verificar rol de admin para rutas administrativas
  // SOLO verificar rol si el user está completamente cargado
  if (
    to.path.startsWith("/admin") &&
    authStore.token &&
    authStore.user &&
    !authStore.isAdmin
  ) {
    console.log("Usuario no es admin:", authStore.user);
    return next("/");
  }

  next();
});

export default router;
