<template>
  <div class="admin-layout">
    <AppSidebar />
    
    <main class="admin-main" :class="{ 'admin-main--with-sidebar': true }">
      <AdminHeader />
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/common/AppSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-secondary, #f8f9fa);
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.admin-main--with-sidebar {
  margin-left: 260px;
}

.admin-content {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
  background: var(--bg-secondary, #f8f9fa);
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-main--with-sidebar {
    margin-left: 0;
  }
  
  .admin-content {
    padding: var(--spacing-md);
  }
}
</style>