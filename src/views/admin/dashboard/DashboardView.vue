<!--
/**
 * Vista del dashboard administrativo
 * @description Panel principal con estadísticas y acceso rápido a funcionalidades
 * @view DashboardView
 */
-->
<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="dashboard-stats">
        <StatsCard title="Total Encuestas" :value="surveyStore.totalSurveys" icon="📊" color="primary" />
        <StatsCard title="Encuestas Activas" :value="surveyStore.activeSurveys.length" icon="✅" color="success" />
        <StatsCard title="Total Respuestas" :value="surveyStore.totalResponses" icon="📝" color="info" />
      </div>
    </header>

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
        <SurveyCard v-for="survey in recentSurveys" :key="survey.id" :survey="survey" @edit="editSurvey"
          @responses="viewResponses" @delete="confirmDelete" @publish="confirmPublish" @close="confirmClose" />
      </div>
    </div>

    <!-- Modales de confirmación -->
    <ConfirmModal v-if="showPublishModal" title="Publicar Encuesta"
      message="¿Estás seguro de que quieres publicar esta encuesta? Una vez publicada, estará disponible para recibir respuestas."
      @confirm="publishSurvey" @cancel="showPublishModal = false" />

    <ConfirmModal v-if="showCloseModal" title="Cerrar Encuesta"
      message="¿Estás seguro de que quieres cerrar esta encuesta? Ya no se podrán enviar más respuestas."
      @confirm="closeSurvey" @cancel="showCloseModal = false" />

    <ConfirmModal v-if="showDeleteModal" title="Eliminar Encuesta"
      message="¿Estás seguro de que quieres eliminar esta encuesta? Esta acción no se puede deshacer."
      @confirm="deleteSurvey" @cancel="showDeleteModal = false" />
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard administrativo con estadísticas y acceso rápido
 * @description Vista principal del admin con métricas y encuestas recientes
 */
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '../../../store/modules/survey'
import StatsCard from '@/components/admin/StatsCard.vue'
import SurveyCard from '@/components/survey/SurveyCard.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const surveyStore = useSurveyStore()

// Estados para modales
const showPublishModal = ref(false)
const showCloseModal = ref(false)
const showDeleteModal = ref(false)

const surveyToPublish = ref<string | null>(null)
const surveyToClose = ref<string | null>(null)
const surveyToDelete = ref<string | null>(null)

/**
 * Obtiene las 3 encuestas más recientemente modificadas
 * @returns Array de las 3 encuestas más recientes
 */
const recentSurveys = computed(() =>
  surveyStore.surveys
    .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
    .slice(0, 3)
)

/**
 * Navega a la vista de edición de una encuesta
 * @param surveyId - ID único de la encuesta a editar
 */
const editSurvey = (surveyId: string) => {
  router.push(`/admin/surveys/${surveyId}/edit`)
}

/**
 * Navega a la vista de respuestas con la encuesta seleccionada
 * @param surveyId - ID de la encuesta
 */
const viewResponses = (surveyId: string) => {
  router.push({ name: 'AdminResponses', query: { survey: surveyId } })
}

/**
 * Confirma la publicación de una encuesta
 * @param surveyId - ID de la encuesta a publicar
 */
const confirmPublish = (surveyId: string) => {
  surveyToPublish.value = surveyId
  showPublishModal.value = true
}

/**
 * Publica la encuesta seleccionada
 */
const publishSurvey = async () => {
  if (surveyToPublish.value) {
    try {
      await surveyStore.publishSurvey(surveyToPublish.value)
      showPublishModal.value = false
      surveyToPublish.value = null
      console.log('✅ Encuesta publicada correctamente')
    } catch (error: any) {
      console.error('❌ Error al publicar encuesta:', error)
      alert('Error al publicar la encuesta: ' + (error.message || 'Error desconocido'))
    }
  }
}

/**
 * Confirma el cierre de una encuesta
 * @param surveyId - ID de la encuesta a cerrar
 */
const confirmClose = (surveyId: string) => {
  surveyToClose.value = surveyId
  showCloseModal.value = true
}

/**
 * Cierra la encuesta seleccionada
 */
const closeSurvey = async () => {
  if (surveyToClose.value) {
    try {
      await surveyStore.closeSurvey(surveyToClose.value)
      showCloseModal.value = false
      surveyToClose.value = null
      console.log('✅ Encuesta cerrada correctamente')
    } catch (error: any) {
      console.error('❌ Error al cerrar encuesta:', error)
      alert('Error al cerrar la encuesta: ' + (error.message || 'Error desconocido'))
    }
  }
}

/**
 * Confirma la eliminación de una encuesta
 * @param surveyId - ID de la encuesta a eliminar
 */
const confirmDelete = (surveyId: string) => {
  surveyToDelete.value = surveyId
  showDeleteModal.value = true
}

/**
 * Elimina la encuesta seleccionada
 */
const deleteSurvey = async () => {
  if (surveyToDelete.value) {
    try {
      await surveyStore.deleteSurvey(surveyToDelete.value)
      showDeleteModal.value = false
      surveyToDelete.value = null
      console.log('✅ Encuesta eliminada correctamente')
    } catch (error: any) {
      console.error('❌ Error al eliminar encuesta:', error)
      alert('Error al eliminar la encuesta: ' + (error.message || 'Error desconocido'))
    }
  }
}

/**
 * Inicializa la vista cargando las encuestas
 */
onMounted(() => {
  surveyStore.fetchSurveys()
})
</script>

<style scoped>
.dashboard {
  padding: 10px var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
  max-width: 1200px;
  margin: 0px auto auto auto;
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