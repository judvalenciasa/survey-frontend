<!--
/**
 * Layout principal del panel de administración
 * @description Layout con sidebar colapsable y área de contenido para admin
 * @component AdminLayout
 */
-->
<template>
  <div
    class="admin-layout"
    :class="{ 'sidebar-collapsed': sidebarCollapsed }"
  >
    <AppSidebar @toggle-sidebar="handleSidebarToggle" />
    <AdminContent />
  </div>
</template>

<script setup lang="ts">
/**
 * Layout administrativo con sidebar y contenido principal
 * @description Gestiona el estado del sidebar y proporciona estructura del admin
 */
import { ref, provide } from 'vue'
import AppSidebar from '@/layouts/dashboard/sidebar/AppSidebar.vue'
import AdminContent from '@/layouts/dashboard/sidebar/AdminContent.vue'

/**
 * Estado del sidebar (colapsado o expandido)
 */
const sidebarCollapsed = ref(false)

/**
 * Maneja el toggle del sidebar
 * @param collapsed - Estado de colapso del sidebar
 */
const handleSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
}

/**
 * Proporciona el estado del sidebar a componentes hijos
 */
provide('sidebarCollapsed', sidebarCollapsed)
</script>

<style scoped>
.admin-layout {
  /* 🎯 CSS GRID DINÁMICO */
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-areas: "sidebar content";
  min-height: 100vh;
  width: 100%;
  background: var(--bg-secondary, #f8f9fa);
  
  /* 🎯 VARIABLES CSS DINÁMICAS */
  --sidebar-width: clamp(250px, 20vw, 300px);
  --sidebar-collapsed-width: clamp(60px, 8vw, 80px);
  --header-height: clamp(60px, 8vh, 80px);
  --content-padding: clamp(1rem, 2.5vw, 2rem);
  
  transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 🎯 ESTADO COLAPSADO */
.admin-layout.sidebar-collapsed {
  grid-template-columns: var(--sidebar-collapsed-width) 1fr;
}

/* 🎯 RESPONSIVE BREAKPOINTS */
@media (max-width: 1024px) {
  .admin-layout {
    --sidebar-width: clamp(220px, 25vw, 250px);
    --content-padding: clamp(0.75rem, 2vw, 1.5rem);
  }
}

@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 
      "sidebar"
      "content";
    --sidebar-width: 100%;
    --content-padding: clamp(0.5rem, 1.5vw, 1rem);
  }
  
  .admin-layout.sidebar-collapsed {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .admin-layout {
    --header-height: clamp(50px, 10vw, 60px);
    --content-padding: clamp(0.5rem, 1vw, 0.75rem);
  }
}

/* 🎯 CONTENEDOR FLUIDO */
@media (min-width: 1400px) {
  .admin-layout {
    --sidebar-width: clamp(280px, 18vw, 320px);
    --content-padding: clamp(1.5rem, 3vw, 2.5rem);
  }
}
</style>