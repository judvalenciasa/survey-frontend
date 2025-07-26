<template>
    <div class="home-page">
      
      <main class="home-main">
        <div class="home-container">
          <header class="home-header">
            <h1 class="home-title">
              {{ appName }}
            </h1>
            <p class="home-subtitle">
              Plataforma integral para la gestión y presentación de encuestas
            </p>
          </header>
  
          <div class="home-cards">
            <HomeCard
              title="Acceso Administrativo"
              description="Ingresa para gestionar encuestas, ver estadísticas y administrar el sistema"
              icon="🔐"
              button-text="Iniciar Sesión"
              button-color="primary"
              @click="goToLogin"
            />
            
            <HomeCard
              title="Presentar Encuesta"
              description="¿Tienes un código de encuesta? Úsalo aquí para acceder y responder"
              icon="📝"
              button-text="Ingresar Código"
              button-color="secondary"
              @click="goToSurvey"
            />
          </div>
        </div>
      </main>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import HomeCard from '@/components/common/HomeCard.vue'
  
  const router = useRouter()
  const appName = import.meta.env.VITE_APP_NAME || 'Sistema de Encuestas'
  
  const goToLogin = () => {
    router.push('/login')
  }
  
  const goToSurvey = () => {
    router.push('/survey-presentation')
  }
  </script>
  
  <style scoped>
  .home-page {
    min-height: 85vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, var(--bg-secondary) 0%, #e0e7ff 100%);
  }
  
  .home-main {
    flex: 1;
    display: flex;
    align-items: center;
    padding: var(--spacing-2xl) var(--spacing-md);
    height: 80%;
  }
  
  .home-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .home-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }
  
  .home-title {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary-color), #3b82f6);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--spacing-md);
    line-height: 1.2;
  }
  
  .home-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  .home-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-2xl);
  }
  
  @media (max-width: 768px) {
    .home-title {
      font-size: 2.2rem;
    }
    
    .home-subtitle {
      font-size: 1rem;
    }
    
    .home-cards {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }
  }
  </style>