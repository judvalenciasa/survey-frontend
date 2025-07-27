<template>
  <header class="admin-header">
    <div class="header-content">
      <div class="header-title">
        <h2>{{ pageTitle }}</h2>
        <p v-if="pageDescription && !isMobile">
          {{ pageDescription }}
        </p>
      </div>
      
      <div class="header-actions">
        <div class="user-info">
          <span
            v-if="!isMobile"
            class="user-name"
          >{{ authStore.user?.email || 'Admin' }}</span>
          <div class="user-avatar">
            {{ userInitials }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

const route = useRoute()
const authStore = useAuthStore()

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

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
  const name = authStore.user?.email || 'Admin'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<style scoped>
.admin-header {
  background: white;
  border-bottom: 1px solid var(--border-color, #e1e5e9);
  padding: 0 var(--content-padding);
  height: var(--header-height);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  
  /* 🎯 SOMBRA DINÁMICA */
  box-shadow: 0 1px clamp(4px, 1vw, 8px) rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: clamp(1rem, 2vw, 2rem);
}

.header-title {
  flex: 1;
  min-width: 0; /* Para permitir truncamiento */
}

.header-title h2 {
  margin: 0;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: var(--text-primary, #2c3e50);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-title p {
  margin: clamp(2px, 0.5vw, 4px) 0 0 0;
  color: var(--text-secondary, #7f8c8d);
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 1rem);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.user-name {
  font-weight: 500;
  color: var(--text-primary, #2c3e50);
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: clamp(100px, 15vw, 200px);
}

.user-avatar {
  width: clamp(32px, 6vw, 40px);
  height: clamp(32px, 6vw, 40px);
  border-radius: 50%;
  background: var(--primary-color, #3498db);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

/* 🎯 RESPONSIVE ESPECÍFICO */
@media (max-width: 480px) {
  .header-content {
    gap: 0.5rem;
  }
  
  .header-title h2 {
    font-size: 1rem;
  }
}
</style>