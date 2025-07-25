<template>
    <div class="admin-layout">
      <AdminSidebar />
      <main class="admin-main">
        <AdminHeader />
        <div class="admin-content">
          <slot />
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: var(--bg-secondary);
  }
  
  .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .admin-content {
    flex: 1;
    padding: var(--spacing-xl);
    overflow-y: auto;
  }
  
  @media (max-width: 768px) {
    .admin-layout {
      flex-direction: column;
    }
  }
  </style>