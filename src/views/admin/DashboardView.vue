<template>
  <div class="dashboard">
    <header class="dashboard-header">
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
    </header>

    <div class="dashboard-actions">
      <router-link
        to="/admin/surveys"
        class="action-button primary"
      >
        Ver Todas las Encuestas
      </router-link>
      <router-link
        to="/admin/surveys/create"
        class="action-button secondary"
      >
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
    .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
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
  padding: 10px var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
  max-width: 1200px;
  margin:0px auto auto auto;
  width: 100%;
  background-color: #0056b3;
}

.dashboard-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.dashboard-header h1 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.dashboard-header p {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
}

.dashboard-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  justify-content: center;
}


.dashboard-actions {
  display: flex;
  flex-wrap: wrap;
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
  flex: 0 1 auto;
  text-align: center;
  min-width: 180px;
}

.action-button.primary {
  background: var(--primary-color);
  color: white;
}

.action-button.primary:hover {
  background: var(--primary-dark, #0056b3);
  transform: translateY(-2px);
}

.action-button.secondary {
  background: var(--primary-color);
  color: white;
}

.action-button.secondary:hover {
  background: var(--secondary-dark, #5a6268);
  transform: translateY(-2px);
}

.dashboard-recent h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  text-align: center;
}

.recent-surveys {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  justify-content: center;
}

.recent-surveys>* {
  flex: 1 1 300px;
  min-width: 280px;
  max-width: 350px;
}

/* Media queries para mejorar la responsividad */
@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-md);
  }

  .dashboard-stats {
    gap: var(--spacing-md);
  }

  .dashboard-stats>* {
    flex: 1 1 100%;
    max-width: none;
  }

  .dashboard-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-button {
    width: 100%;
    max-width: 300px;
  }

  .recent-surveys>* {
    flex: 1 1 100%;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: var(--spacing-sm);
  }

  .dashboard-header {
    margin-bottom: var(--spacing-lg);
  }

  .dashboard-stats,
  .dashboard-actions {
    margin-bottom: var(--spacing-lg);
  }

  .action-button {
    padding: var(--spacing-sm) var(--spacing-md);
    min-width: 150px;
  }
}

@media (min-width: 1200px) {
  .dashboard-stats>* {
    max-width: 260px;
  }

  .recent-surveys>* {
    max-width: 320px;
  }
}
</style>