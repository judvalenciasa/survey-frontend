<template>
    <AppNavbar />
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">
          {{ appName }}
        </h1>
        <p class="login-subtitle">
          Accede a tu cuenta para gestionar encuestas
        </p>
      </div>
      
      <LoginForm />
    </div>
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const appName = import.meta.env.VITE_APP_NAME || 'Sistema de Encuestas'
</script>

<style scoped>
/* Layout principal de la página de login */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #e0e7ff 100%);
}

/* Contenedor del formulario */
.login-container {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-2xl);
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
}

/* Header del login */
.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

/* Título principal */
.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

/* Subtítulo */
.login-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: var(--spacing-lg);
    margin: var(--spacing-md);
  }
  
  .login-title {
    font-size: 1.75rem;
  }
  
  .login-subtitle {
    font-size: 0.9rem;
  }
}
</style>