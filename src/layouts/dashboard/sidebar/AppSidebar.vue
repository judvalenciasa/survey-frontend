<template>
    <aside class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <h3 v-if="!isCollapsed">📊 FormST&T</h3>
          <span v-else>📊</span>
        </div>
        <button @click="toggleSidebar" class="sidebar-toggle">
          <span>{{ isCollapsed ? '→' : '←' }}</span>
        </button>
      </div>
  
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/admin/dashboard" class="nav-link" active-class="nav-link--active">
              <span class="nav-icon">🏠</span>
              <span v-if="!isCollapsed" class="nav-text">Dashboard</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/admin/surveys" class="nav-link" active-class="nav-link--active">
              <span class="nav-icon">📝</span>
              <span v-if="!isCollapsed" class="nav-text">Encuestas</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/admin/surveys/create" class="nav-link" active-class="nav-link--active">
              <span class="nav-icon">➕</span>
              <span v-if="!isCollapsed" class="nav-text">Nueva Encuesta</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/admin/responses" class="nav-link" active-class="nav-link--active">
              <span class="nav-icon">📊</span>
              <span v-if="!isCollapsed" class="nav-text">Respuestas</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/admin/analytics" class="nav-link" active-class="nav-link--active">
              <span class="nav-icon">📈</span>
              <span v-if="!isCollapsed" class="nav-text">Analíticas</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/admin/users" class="nav-link" active-class="nav-link--active">
              <span class="nav-icon">👥</span>
              <span v-if="!isCollapsed" class="nav-text">Usuarios</span>
            </router-link>
          </li>
        </ul>
      </nav>
  
      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <span class="nav-icon">🚪</span>
          <span v-if="!isCollapsed" class="nav-text">Salir</span>
        </button>
      </div>
    </aside>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/modules/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const isCollapsed = ref(false)
  
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }
  
  const logout = async () => {
    await authStore.logout()
    router.push('/auth/login')
  }
  </script>
  
  <style scoped>
  .sidebar {
    width: 260px;
    background: var(--bg-primary, #2c3e50);
    color: white;
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    background-color: var(--primary-color);
  }
  
  .sidebar--collapsed {
    width: 70px;
  }
  
  .sidebar-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 70px;
  }
  
  .sidebar-brand h3 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--primary-light, #3498db);
  }
  
  .sidebar-toggle {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .sidebar-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md) 0;
  }
  
  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-item {
    margin-bottom: 4px;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.2s ease;
    border-radius: 0 25px 25px 0;
    margin-right: var(--spacing-md);
  }
  
  .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .nav-link--active {
    background: var(--primary-color, #3498db);
    color: white;
  }
  
  .nav-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
    margin-right: var(--spacing-md);
  }
  
  .sidebar--collapsed .nav-icon {
    margin-right: 0;
  }
  
  .nav-text {
    font-weight: 500;
    white-space: nowrap;
  }
  
  .sidebar-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .logout-btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--spacing-md);
    background: rgba(231, 76, 60, 0.8);
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .logout-btn:hover {
    background: rgba(231, 76, 60, 1);
  }
  
  .logout-btn .nav-icon {
    margin-right: var(--spacing-md);
  }
  
  .sidebar--collapsed .logout-btn .nav-icon {
    margin-right: 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: auto;
      position: relative;
      box-shadow: none;
    }
    
    .sidebar--collapsed {
      width: 100%;
    }
    
    .sidebar-header {
      justify-content: center;
    }
    
    .sidebar-toggle {
      display: none;
    }
    
    .nav-link {
      justify-content: center;
      margin-right: 0;
      border-radius: 6px;
      margin: 0 var(--spacing-md) 4px;
    }
  }
  </style>