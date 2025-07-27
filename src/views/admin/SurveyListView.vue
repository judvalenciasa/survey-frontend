<template>
  <div class="survey-list">
    <header class="list-header">
      <h1>Mis Encuestas</h1>
      <router-link
        to="/admin/surveys/create"
        class="create-btn"
      >
        Crear Nueva Encuesta
      </router-link>
    </header>

    <div class="list-filters">
      <div class="filter-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar encuestas..."
          class="search-input"
        >
        <select
          v-model="statusFilter"
          class="status-filter"
        >
          <option value="">
            Todas
          </option>
          <option value="active">
            Activas
          </option>
          <option value="inactive">
            Inactivas
          </option>
        </select>
      </div>
    </div>

    <div
      v-if="surveyStore.loading"
      class="loading"
    >
      Cargando encuestas...
    </div>

    <div
      v-else-if="surveyStore.error"
      class="error"
    >
      {{ surveyStore.error }}
    </div>

    <div
      v-else-if="filteredSurveys.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">
        📊
      </div>
      <h3>No tienes encuestas aún</h3>
      <p>Crea tu primera encuesta para comenzar</p>
      <router-link
        to="/admin/surveys/create"
        class="create-btn"
      >
        Crear Primera Encuesta
      </router-link>
    </div>

    <div
      v-else
      class="surveys-grid"
    >
      <SurveyCard
        v-for="survey in filteredSurveys"
        :key="survey.id"
        :survey="survey"
        @view="viewSurvey"
        @edit="editSurvey"
        @responses="viewResponses"
        @delete="confirmDelete"
        @publish="confirmPublish"
        @close="confirmClose"
      />
    </div>

    <!-- Modal de confirmación -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Eliminar Encuesta"
      message="¿Estás seguro de que quieres eliminar esta encuesta? Esta acción no se puede deshacer."
      @confirm="deleteSurvey"
      @cancel="showDeleteModal = false"
    />

    <!-- ✨ NUEVO: Modal de confirmación para publicar -->
    <ConfirmModal
      v-if="showPublishModal"
      title="Publicar Encuesta"
      message="¿Estás seguro de que quieres publicar esta encuesta? Una vez publicada, estará disponible para recibir respuestas."
      @confirm="publishSurvey"
      @cancel="showPublishModal = false"
    />

    <!-- ✨ NUEVO: Modal de confirmación para cerrar -->
    <ConfirmModal
      v-if="showCloseModal"
      title="Cerrar Encuesta"
      message="¿Estás seguro de que quieres cerrar esta encuesta? Ya no se podrán enviar más respuestas."
      @confirm="closeSurvey"
      @cancel="showCloseModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '../../store/modules/survey'
import SurveyCard from '../../components/survey/SurveyCard.vue' 
import ConfirmModal from '../../components/common/ConfirmModal.vue'

const router = useRouter()
const surveyStore = useSurveyStore()

const searchQuery = ref('')
const statusFilter = ref('')

// Estados para modales
const showDeleteModal = ref(false)
const showPublishModal = ref(false)
const showCloseModal = ref(false)

const surveyToDelete = ref<string | null>(null)
const surveyToPublish = ref<string | null>(null)
const surveyToClose = ref<string | null>(null)

const filteredSurveys = computed(() => {
  let filtered = surveyStore.surveys

  // Filtrar por búsqueda (corregido para usar 'name' en lugar de 'title')
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(survey => 
      survey.name.toLowerCase().includes(query) ||
      survey.description.toLowerCase().includes(query)
    )
  }

  // Filtrar por estado (actualizado para usar 'status')
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(survey => survey.status === 'PUBLICADA')
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(survey => survey.status !== 'PUBLICADA')
  }

  return filtered
})

// ✨ NUEVA FUNCIÓN: Validar y cerrar encuestas vencidas
const validateAndCloseExpiredSurveys = async () => {
  const now = new Date()
  const expiredSurveys = surveyStore.surveys.filter(survey => {
    // Solo validar encuestas publicadas que tengan fecha de cierre
    if (survey.status !== 'PUBLICADA' || !survey.scheduledClose) {
      return false
    }
    
    const closeDate = new Date(survey.scheduledClose)
    return closeDate <= now
  })

  // Cerrar encuestas vencidas automáticamente
  if (expiredSurveys.length > 0) {
    console.log(`Encontradas ${expiredSurveys.length} encuestas vencidas, cerrando automáticamente...`)
    
    for (const survey of expiredSurveys) {
      try {
        await surveyStore.closeSurvey(survey.id)
        console.log(`Encuesta "${survey.name}" cerrada automáticamente por vencimiento`)
      } catch (error) {
        console.error(`Error al cerrar encuesta "${survey.name}":`, error)
      }
    }
  }
}

// ✨ NUEVA FUNCIÓN: Cargar encuestas con validación
const loadSurveysWithValidation = async () => {
  try {
    // Primero cargar las encuestas
    await surveyStore.fetchSurveys()
    
    // Luego validar y cerrar las vencidas
    await validateAndCloseExpiredSurveys()
  } catch (error) {
    console.error('Error al cargar encuestas:', error)
  }
}

const viewSurvey = (id: string) => {
  router.push(`/admin/surveys/${id}`)
}

const editSurvey = (id: string) => {
  router.push(`/admin/surveys/${id}/edit`)
}

const viewResponses = (id: string) => {
  router.push(`/admin/surveys/${id}/responses`)
}

const confirmDelete = (id: string) => {
  surveyToDelete.value = id
  showDeleteModal.value = true
}

const deleteSurvey = async () => {
  if (surveyToDelete.value) {
    try {
      await surveyStore.deleteSurvey(surveyToDelete.value)
      showDeleteModal.value = false
      surveyToDelete.value = null
    } catch (error) {
      console.error('Error al eliminar encuesta:', error)
    }
  }
}

const confirmPublish = (id: string) => {
  surveyToPublish.value = id
  showPublishModal.value = true
}

const publishSurvey = async () => {
  if (surveyToPublish.value) {
    try {
      await surveyStore.publishSurvey(surveyToPublish.value)
      showPublishModal.value = false
      surveyToPublish.value = null
    } catch (error) {
      console.error('Error al publicar encuesta:', error)
    }
  }
}

const confirmClose = (id: string) => {
  surveyToClose.value = id
  showCloseModal.value = true
}

const closeSurvey = async () => {
  if (surveyToClose.value) {
    try {
      await surveyStore.closeSurvey(surveyToClose.value)
      showCloseModal.value = false
      surveyToClose.value = null
    } catch (error) {
      console.error('Error al cerrar encuesta:', error)
    }
  }
}

// ✨ ACTUALIZADO: Usar la nueva función de carga con validación
onBeforeMount(async () => {
  await loadSurveysWithValidation()
})

// ✨ REMOVIDO: onMounted duplicado para evitar doble carga
</script>

<style scoped>
.survey-list {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.list-header h1 {
  color: var(--text-primary);
  font-size: 2rem;
  margin: 0;
}

.create-btn {
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease;
}

.create-btn:hover {
  background: var(--primary-hover);
}

.list-filters {
  margin-bottom: var(--spacing-xl);
}

.filter-group {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.search-input {
  flex: 1;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.status-filter {
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background: var(--bg-primary);
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-secondary);
}

.error {
  color: var(--error-color);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.surveys-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .surveys-grid {
    grid-template-columns: 1fr;
  }
}

/* ✨ NUEVOS ESTILOS PARA LOS BOTONES */
.publish-btn {
  background: var(--success-color, #10b981);
  color: white;
}

.publish-btn:hover {
  background: var(--success-hover, #059669);
}

.close-btn {
  background: var(--warning-color, #f59e0b);
  color: white;
}

.close-btn:hover {
  background: var(--warning-hover, #d97706);
}

/* Estilos para botones deshabilitados */
.action-btn:disabled {
  background: var(--gray-300, #d1d5db);
  color: var(--gray-500, #6b7280);
  cursor: not-allowed;
  opacity: 0.6;
}

.action-btn:disabled:hover {
  background: var(--gray-300, #d1d5db);
}

/* Actualizar colores de estado */
.status-active {
  background: var(--success-color, #10b981);
  color: white;
}

.status-created {
  background: var(--info-color, #3b82f6);
  color: white;
}

.status-finished {
  background: var(--gray-500, #6b7280);
  color: white;
}

.status-paused {
  background: var(--warning-color, #f59e0b);
  color: white;
}
</style>
