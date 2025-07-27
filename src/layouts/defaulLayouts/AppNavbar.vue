<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link
          to="/"
          class="brand-link"
        >
          <span class="brand-icon">📊</span>
          <span class="brand-text">{{ appName }}</span>
        </router-link>
      </div>

      <div class="navbar-menu">
        <router-link
          to="/"
          class="nav-link"
        >
          Inicio
        </router-link>
        <router-link
          to="/login"
          class="nav-link"
        >
          Acceso
        </router-link>
        <router-link
          to="/survey-presentation"
          class="nav-link"
        >
          Encuesta
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME || 'FormSTyT'
</script>

<style scoped>
.navbar {
  background: var(--text-primary);
  background-color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;

}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
}

.navbar-brand .brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
}

.brand-icon {
  font-size: 1.5rem;
  margin-right: var(--spacing-sm);
}

.brand-text {
  color: var(--primary-color);
}

.navbar-menu {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-fondo);
  background-color: rgba(37, 99, 235, 0.1);
}


@media (max-width: 768px) {
  .navbar-container {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .brand-text {
    display: none;
  }

  .navbar-menu {
    gap: var(--spacing-sm);
  }

  .nav-link {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.9rem;
  }
}
</style>