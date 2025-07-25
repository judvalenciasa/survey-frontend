<template>
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Panel Administrativo</h1>
        <p>Gestiona tus encuestas y revisa estadísticas</p>
      </header>
  
      <div class="dashboard-stats">
        <StatsCard
          title="Total Encuestas"
          :value="surveyStore.totalSurveys"
          icon="📊"
          color="primary"
        />
        <StatsCard
          title="Encuestas Activas"
          :value="surveyStore.activeSurveys.length"
          icon="✅"
          color="success"
        />
        <StatsCard
          title="Total Respuestas"
          :value="surveyStore.totalResponses"
          icon="📝"
          color="info"
        />
        <StatsCard
          title="Respuestas Hoy"
          :value="todayResponses"
          icon="🗓️"
          color="warning"
        />
      </div>
  
      <div class="dashboard-actions">
        <router-link to="/admin/surveys" class="action-button primary">
          Ver Todas las Encuestas
        </router-link>
        <router-link to="/admin/surveys/create" class="action-button secondary">
          Crear Nueva Encuesta
        </router-link>
      </div>
  
      <div class="dashboard-recent">
        <h2>Encuestas Recientes</h2>
        <div class="recent-surveys">
          <SurveyCard
            v-for="survey in recentSurveys"
            :key="survey.id"
            :survey="survey"
            @view="viewSurvey"
            @edit="editSurvey"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSurveyStore } from '@/store/modules/survey'
  import StatsCard from '@/components/admin/StatsCard.vue'
  import SurveyCard from '@/components/survey/SurveyCard.vue'
  
  const router = useRouter()
  const surveyStore = useSurveyStore()
  
  const recentSurveys = computed(() => 
    surveyStore.surveys
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
  )
  
  const todayResponses = computed(() => {
    // Aquí calcularías las respuestas de hoy
    // Por ahora retornamos un valor dummy
    return 12
  })
  
  const viewSurvey = (surveyId: string) => {
    router.push(`/admin/surveys/${surveyId}`)
  }
  
  const editSurvey = (surveyId: string) => {
    router.push(`/admin/surveys/${surveyId}/edit`)
  }
  
  onMounted(() => {
    surveyStore.fetchSurveys()
  })
  </script>
  
  <style scoped>
  .dashboard {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .dashboard-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }
  
  .dashboard-header h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
  }
  
  .dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-2xl);
  }
  
  .dashboard-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    margin-bottom: var(--spacing-2xl);
  }
  
  .action-button {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .action-button.primary {
    background: var(--primary-color);
    color: white;
  }
  
  .action-button.secondary {
    background: var(--secondary-color);
    color: white;
  }
  
  .dashboard-recent h2 {
    margin-bottom: var(--spacing-lg);
    color: var(--text-primary);
  }
  
  .recent-surveys {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
  }
  </style>