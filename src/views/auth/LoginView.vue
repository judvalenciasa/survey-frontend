<!--
/**
 * Vista de página de inicio de sesión
 * @description Página de autenticación para acceder al panel administrativo
 * @view LoginView
 */
-->
<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <p class="login-subtitle">
          Accede a tu cuenta para gestionar encuestas
        </p>
      </div>
      
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Vista de login con formulario centrado y diseño responsivo
 * @description Página que contiene el formulario de autenticación
 */
import LoginForm from '@/components/auth/LoginForm.vue'

</script>

<style scoped>
/* Layout principal de la página de login */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #e0e7ff 100%);
}

/* Contenedor del formulario */
.login-container {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 0px 15px rgba(0, 0, 0, 0.3); /* Sombra más oscura y pronunciada */
  padding: 2rem;
  margin-top: 10%;
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