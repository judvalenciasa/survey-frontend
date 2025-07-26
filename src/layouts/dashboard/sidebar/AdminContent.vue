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
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Para que el contenido no se desborde */
  }
  
  .admin-main-content {
    flex: 1;
    padding: var(--spacing-xl);
    overflow-y: auto;
    background: var(--bg-secondary, #f8f9fa);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .admin-main-content {
      padding: var(--spacing-md);
    }
  }
  </style>