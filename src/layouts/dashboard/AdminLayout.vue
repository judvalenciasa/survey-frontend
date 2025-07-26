<template>
  <div class="admin-layout">
    <AppSidebar />
    <AdminContent class="admin-main" />
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/layouts/dashboard/sidebar/AppSidebar.vue'
import AdminContent from '@/layouts/dashboard/sidebar/AdminContent.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-secondary, #f8f9fa);
  width: 100%;
}

.admin-main {
  margin-left: 10%; /* Espacio para el sidebar */
  transition: margin-left 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-main {
    margin-left: 0;
  }
}
</style>