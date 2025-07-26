<template>
    <header class="admin-header">
      <div class="header-content">
        <div class="header-title">
          <h2>{{ pageTitle }}</h2>
          <p v-if="pageDescription">{{ pageDescription }}</p>
        </div>
        
        <div class="header-actions">
          <div class="user-info">
            <span class="user-name">{{ authStore.user?.email || 'Admin' }}</span>
            <div class="user-avatar">
              {{ userInitials }}
            </div>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/store/modules/auth'
  
  const route = useRoute()
  const authStore = useAuthStore()
  
  const pageTitle = computed(() => {
    const titles: Record<string, string> = {
      'Dashboard': 'Panel Administrativo',
      'SurveyList': 'Gestión de Encuestas',
      'SurveyCreate': 'Crear Nueva Encuesta',
      'SurveyEdit': 'Editar Encuesta',
      'ResponseView': 'Respuestas y Analíticas',
      'AnalyticsView': 'Analíticas Avanzadas',
      'UserView': 'Gestión de Usuarios'
    }
    return titles[route.name as string] || 'Administración'
  })
  
  const pageDescription = computed(() => {
    const descriptions: Record<string, string> = {
      'Dashboard': 'Resumen general de tu sistema de encuestas',
      'SurveyList': 'Administra todas tus encuestas existentes',
      'SurveyCreate': 'Crea una nueva encuesta personalizada',
      'SurveyEdit': 'Modifica y personaliza tu encuesta',
      'ResponseView': 'Revisa las respuestas y estadísticas detalladas',
      'AnalyticsView': 'Análisis profundo de datos y tendencias',
      'UserView': 'Administra usuarios y permisos del sistema'
    }
    return descriptions[route.name as string]
  })
  
  const userInitials = computed(() => {
    const name = authStore.user?.roles[0] || 'Admin'
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
  })
  </script>
  
  <style scoped>
  .admin-header {
    background: white;
    border-bottom: 1px solid var(--border-color, #e1e5e9);
    padding: 0 var(--spacing-xl);
    min-height: 70px;
    display: flex;
    align-items: center;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .header-title h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-primary, #2c3e50);
    font-weight: 600;
  }
  
  .header-title p {
    margin: 4px 0 0 0;
    color: var(--text-secondary, #7f8c8d);
    font-size: 0.9rem;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .user-name {
    font-weight: 500;
    color: var(--text-primary, #2c3e50);
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-color, #3498db);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    .admin-header {
      padding: 0 var(--spacing-md);
      min-height: 60px;
    }
    
    .header-title h2 {
      font-size: 1.2rem;
    }
    
    .header-title p {
      display: none;
    }
    
    .user-name {
      display: none;
    }
    
    .user-avatar {
      width: 35px;
      height: 35px;
    }
  }
  </style>