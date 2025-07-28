/**
 * Rutas de autenticación
 * @description Define las rutas para login y procesos de autenticación
 * @module Auth Routes
 */
import type { RouteRecordRaw } from "vue-router";
import FullLayout from "@/layouts/full/FullLayout.vue";

/**
 * Configuración de rutas de autenticación
 * @description Rutas para usuarios no autenticados (login, registro, etc.)
 */
const authRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    component: FullLayout,
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/auth/LoginView.vue"),
        alias: "/login",
        meta: {
          requiresGuest: true,
        },
      },
    ],
  },
];

export default authRoutes;
