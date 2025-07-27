<template>
  <div class="admin-content-wrapper">
    <AdminHeader />
   
    <main class="admin-main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/layouts/dashboard/sidebar/AdminHeader.vue'
</script>

<style scoped>
.admin-content-wrapper {
  grid-area: content;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.admin-main-content {
  flex: 1;
  padding: var(--content-padding);
  overflow-y: auto;
  background: var(--bg-secondary, #f8f9fa);
  
  /* 🎯 SCROLL SUAVE */
  scroll-behavior: smooth;
  
  /* 🎯 CONTENEDOR FLUIDO */
  container-type: inline-size;
}

/* 🎯 CONTAINER QUERIES PARA CONTENIDO */
@container (max-width: 600px) {
  .admin-main-content {
    padding: clamp(0.5rem, 2vw, 1rem);
  }
}

@container (min-width: 1200px) {
  .admin-main-content {
    padding: clamp(1.5rem, 3vw, 2.5rem);
  }
}

/* 🎯 RESPONSIVE TRADICIONAL COMO FALLBACK */
@media (max-width: 768px) {
  .admin-main-content {
    padding: clamp(0.5rem, 2vw, 1rem);
  }
}

@media (max-width: 480px) {
  .admin-main-content {
    padding: clamp(0.25rem, 1vw, 0.75rem);
  }
}
</style>