<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--collapsed': isCollapsed }"
  >
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <h3
          v-show="!isCollapsed"
          class="brand-text"
        >
          📊 FormST&T
        </h3>
        <span
          v-show="isCollapsed"
          class="brand-icon"
        >📊</span>
      </div>
      <button
        class="sidebar-toggle"
        :aria-label="isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'"
        @click="toggleSidebar"
      >
        <span>{{ isCollapsed ? '→' : '←' }}</span>
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link
            to="/admin/dashboard"
            class="nav-link"
            active-class="nav-link--active"
          >
            <span class="nav-icon">🏠</span>
            <span
              v-show="!isCollapsed"
              class="nav-text"
            >Dashboard</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link
            to="/admin/surveys"
            class="nav-link"
            active-class="nav-link--active"
          >
            <span class="nav-icon">📝</span>
            <span
              v-show="!isCollapsed"
              class="nav-text"
            >Encuestas</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link
            to="/admin/surveys/create"
            class="nav-link"
            active-class="nav-link--active"
          >
            <span class="nav-icon">➕</span>
            <span
              v-show="!isCollapsed"
              class="nav-text"
            >Nueva Encuesta</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link
            to="/admin/responses"
            class="nav-link"
            active-class="nav-link--active"
          >
            <span class="nav-icon">📊</span>
            <span
              v-show="!isCollapsed"
              class="nav-text"
            >Respuestas</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link
            to="/admin/analytics"
            class="nav-link"
            active-class="nav-link--active"
          >
            <span class="nav-icon">📈</span>
            <span
              v-show="!isCollapsed"
              class="nav-text"
            >Analíticas</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link
            to="/admin/users"
            class="nav-link"
            active-class="nav-link--active"
          >
            <span class="nav-icon">👥</span>
            <span
              v-show="!isCollapsed"
              class="nav-text"
            >Usuarios</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button
        class="logout-btn"
        @click="logout"
      >
        <span class="nav-icon">🚪</span>
        <span
          v-show="!isCollapsed"
          class="nav-text"
        >Salir</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

const emit = defineEmits<{
  toggleSidebar: [collapsed: boolean]
}>()

const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)

// Detectar tamaño de pantalla automáticamente
const handleResize = () => {
  if (window.innerWidth <= 768) {
    isCollapsed.value = true
  } else if (window.innerWidth >= 1200) {
    isCollapsed.value = false
  }
}

// Configurar responsive automático
if (typeof window !== 'undefined') {
  handleResize()
  window.addEventListener('resize', handleResize)
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggleSidebar', isCollapsed.value)
}

// Emit inicial
watch(isCollapsed, (newValue) => {
  emit('toggleSidebar', newValue)
}, { immediate: true })

const logout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.sidebar {
  grid-area: sidebar;
  background: var(--primary-color, #2c3e50);
  color: white;
  display: flex;
  flex-direction: column;
  
  /* 🎯 DIMENSIONES DINÁMICAS */
  width: var(--sidebar-width);
  height: 100vh;
  position: sticky;
  top: 0;
  
  /* 🎯 SOMBRA DINÁMICA */
  box-shadow: clamp(2px, 0.5vw, 4px) 0 clamp(10px, 2vw, 20px) rgba(0, 0, 0, 0.1);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  padding: var(--content-padding);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  flex-shrink: 0;
}

.brand-text {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: white;
  white-space: nowrap;
  overflow: hidden;
}

.brand-icon {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: clamp(4px, 1vw, 8px);
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: clamp(0.5rem, 1vw, 1rem) 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: clamp(2px, 0.5vw, 4px);
}

.nav-link {
  display: flex;
  align-items: center;
  padding: clamp(0.5rem, 1.5vw, 0.75rem) var(--content-padding);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0 25px 25px 0;
  margin-right: clamp(0.5rem, 1vw, 1rem);
  position: relative;
  overflow: hidden;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(4px);
}

.nav-link--active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
}

.nav-icon {
  font-size: clamp(1rem, 2vw, 1.2rem);
  width: clamp(20px, 4vw, 24px);
  text-align: center;
  margin-right: clamp(0.5rem, 1vw, 0.75rem);
  flex-shrink: 0;
}

.sidebar--collapsed .nav-icon {
  margin-right: 0;
}

.nav-text {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.sidebar--collapsed .nav-text {
  opacity: 0;
}

.sidebar-footer {
  padding: var(--content-padding);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: clamp(0.5rem, 1.5vw, 0.75rem);
  background: rgba(231, 76, 60, 0.8);
  border: none;
  border-radius: clamp(4px, 1vw, 6px);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 1);
  transform: translateY(-1px);
}

.logout-btn .nav-icon {
  margin-right: clamp(0.5rem, 1vw, 0.75rem);
}

.sidebar--collapsed .logout-btn .nav-icon {
  margin-right: 0;
}

/* 🎯 RESPONSIVE ESPECÍFICO */
@media (max-width: 768px) {
  .sidebar {
    position: relative;
    width: 100% !important;
    height: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
    border-radius: clamp(4px, 1vw, 6px);
    margin: 0 var(--content-padding) clamp(2px, 0.5vw, 4px);
  }
  
  .nav-text {
    opacity: 1 !important;
  }
}

@media (max-width: 480px) {
  .nav-link {
    padding: clamp(0.4rem, 1vw, 0.6rem) clamp(0.5rem, 1vw, 0.75rem);
  }
  
  .sidebar-header {
    padding: clamp(0.5rem, 1vw, 0.75rem);
  }
}
</style>