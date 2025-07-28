<!--
/**
 * Vista de gestión de respuestas de encuestas
 * @description Página administrativa para visualizar y gestionar respuestas de encuestas
 * @view ResponseView
 */
-->
<template>
  <div class="response-view">
    <header class="response-header">
      <div class="header-content">
        <div class="header-info">
          <h1>Respuestas de Encuestas</h1>
          <p v-if="selectedSurvey" class="survey-title">
            {{ selectedSurvey.name }}
          </p>
        </div>

        <div class="header-actions">
          <select v-model="selectedSurveyId" class="survey-selector" @change="loadResponsesForSurvey">
            <option value="">Seleccionar encuesta...</option>
            <option v-for="survey in surveys" :key="survey.id" :value="survey.id">
              {{ survey.name }} ({{ survey.totalResponses || 0 }} respuestas)
            </option>
          </select>

          <button v-if="selectedSurveyId && responses.length > 0" class="export-btn" @click="exportResponses"
            :disabled="loading">
            📊 Exportar CSV
          </button>
        </div>
      </div>
    </header>

    <!-- Estadísticas -->
    <div v-if="selectedSurveyId && stats" class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalResponses }}</div>
            <div class="stat-label">Total Respuestas</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatTime(stats.averageCompletionTime) }}</div>
            <div class="stat-label">Tiempo Promedio</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.completionRate.toFixed(1) }}%</div>
            <div class="stat-label">Tasa de Finalización</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div v-if="selectedSurveyId" class="filters-section">
      <div class="filters">
        <input v-model="searchQuery" type="text" placeholder="Buscar por ID de respuesta..." class="search-input">

        <input v-model="dateFilter" type="date" class="date-filter">

        <button class="clear-filters-btn" @click="clearFilters">
          Limpiar Filtros
        </button>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando respuestas...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h3>Error al cargar respuestas</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadResponsesForSurvey">
        Reintentar
      </button>
    </div>

    <!-- Sin encuesta seleccionada -->
    <div v-else-if="!selectedSurveyId" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>Selecciona una encuesta</h3>
      <p>Elige una encuesta del menú desplegable para ver sus respuestas.</p>
    </div>

    <!-- Sin respuestas -->
    <div v-else-if="selectedSurveyId && responses.length === 0 && !loading" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>Sin respuestas aún</h3>
      <p>Esta encuesta no ha recibido respuestas todavía.</p>
    </div>

    <!-- Lista de respuestas -->
    <div v-else-if="filteredResponses.length > 0" class="responses-section">
      <div class="responses-header">
        <h2>Respuestas ({{ filteredResponses.length }})</h2>

        <div class="view-options">
          <button :class="['view-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">
            📄 Lista
          </button>
          <button :class="['view-btn', { active: viewMode === 'analysis' }]" @click="viewMode = 'analysis'">
            📊 Análisis
          </button>
        </div>
      </div>

      <!-- Vista de Lista -->
      <div v-if="viewMode === 'list'" class="responses-list">
        <div v-for="response in paginatedResponses" :key="response.id" class="response-card">
          <div class="response-header">
            <div class="response-info">
              <span class="response-id">ID: {{ response.id.slice(0, 8) }}...</span>
              <span class="response-date">{{ formatDate(response.submittedAt) }}</span>
            </div>

            <div class="response-actions">
              <button class="action-btn view-btn-small" @click="viewResponseDetails(response)">
                👁️ Ver
              </button>
              <button class="action-btn delete-btn-small" @click="confirmDeleteResponse(response)">
                🗑️ Eliminar
              </button>
            </div>
          </div>

          <div class="response-summary">
            <div class="answer-count">
              {{ Object.keys(response.answers).length }} respuestas
            </div>
            <div v-if="response.ipAddress" class="ip-info">
              IP: {{ response.ipAddress }}
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de Análisis -->
      <div v-else-if="viewMode === 'analysis'" class="analysis-view">
        <ResponseAnalytics v-if="analysis" :analysis="analysis" :survey="selectedSurvey" />
        <div v-else class="loading-analysis">
          Cargando análisis...
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn">
          ← Anterior
        </button>

        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>

        <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn">
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <ConfirmModal v-if="showDeleteModal" title="Eliminar Respuesta"
      message="¿Estás seguro de que quieres eliminar esta respuesta? Esta acción no se puede deshacer."
      @confirm="deleteResponse" @cancel="showDeleteModal = false" />

    <!-- Modal de detalles de respuesta -->
    <ResponseDetailsModal v-if="showDetailsModal && selectedResponse" :response="selectedResponse"
      :survey="selectedSurvey" @close="showDetailsModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSurveyStore } from '@/store/modules/survey'
import { responseService } from '@/services/response.service'
import type { SurveyResponse, ResponseStats } from '@/types/response'
// import type { Survey } from '@/types/survey' // ❌ Remover si causa problema
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import ResponseAnalytics from '@/components/response/ResponseAnalitysc.vue'
import { useRoute } from 'vue-router'

/**
 * Vista de gestión de respuestas con funcionalidades completas
 * @description Permite visualizar, filtrar, exportar y gestionar respuestas de encuestas
 */

// Store
const surveyStore = useSurveyStore()
const route = useRoute()

// Estado reactivo
const selectedSurveyId = ref<string>('')
const responses = ref<SurveyResponse[]>([])
const stats = ref<ResponseStats | null>(null)
const analysis = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Filtros y búsqueda
const searchQuery = ref('')
const dateFilter = ref('')
const viewMode = ref<'list' | 'analysis'>('list')

// Paginación
const currentPage = ref(1)
const itemsPerPage = 10

// Modales
const showDeleteModal = ref(false)
const showDetailsModal = ref(false)
const selectedResponse = ref<SurveyResponse | null>(null)

/**
 * Encuestas disponibles del usuario
 */
const surveys = computed(() => surveyStore.surveys)

/**
 * Encuesta actualmente seleccionada
 */
const selectedSurvey = computed(() => 
  surveys.value.find(s => s.id === selectedSurveyId.value)
)

/**
 * Respuestas filtradas según criterios de búsqueda
 */
const filteredResponses = computed(() => {
  let filtered = responses.value

  if (searchQuery.value) {
    filtered = filtered.filter(response =>
      response.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (dateFilter.value) {
    const filterDate = new Date(dateFilter.value)
    filtered = filtered.filter(response => {
      const responseDate = new Date(response.submittedAt)
      return responseDate.toDateString() === filterDate.toDateString()
    })
  }

  return filtered
})

/**
 * Respuestas paginadas
 */
const paginatedResponses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredResponses.value.slice(start, end)
})

/**
 * Total de páginas para paginación
 */
const totalPages = computed(() =>
  Math.ceil(filteredResponses.value.length / itemsPerPage)
)

/**
 * Carga las respuestas para la encuesta seleccionada
 */
const loadResponsesForSurvey = async () => {
  if (!selectedSurveyId.value) {
    responses.value = []
    stats.value = null
    analysis.value = null
    return
  }

  loading.value = true
  error.value = null

  try {
    // Cargar respuestas, estadísticas y análisis en paralelo
    const [responsesRes, statsRes, analysisRes] = await Promise.all([
      responseService.getResponsesBySurvey(selectedSurveyId.value),
      responseService.getResponseStats(selectedSurveyId.value),
      responseService.getResponseAnalysis(selectedSurveyId.value)
    ])

    responses.value = responsesRes.data
    stats.value = statsRes.data
    analysis.value = analysisRes.data
    currentPage.value = 1 // Reset pagination

  } catch (err: any) {
    console.error('Error loading responses:', err)
    error.value = err.response?.data?.message || 'Error al cargar las respuestas'
  } finally {
    loading.value = false
  }
}

/**
 * Exporta las respuestas en formato CSV
 */
const exportResponses = async () => {
  if (!selectedSurveyId.value) return

  try {
    const response = await responseService.exportResponses(selectedSurveyId.value)

    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `respuestas-${selectedSurvey.value?.name || 'encuesta'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

  } catch (err: any) {
    console.error('Error exporting responses:', err)
    error.value = 'Error al exportar las respuestas'
  }
}

/**
 * Limpia todos los filtros aplicados
 */
const clearFilters = () => {
  searchQuery.value = ''
  dateFilter.value = ''
  currentPage.value = 1
}

/**
 * Muestra los detalles de una respuesta específica
 * @param response - Respuesta a mostrar
 */
const viewResponseDetails = (response: SurveyResponse) => {
  selectedResponse.value = response
  showDetailsModal.value = true
}

/**
 * Confirma la eliminación de una respuesta
 * @param response - Respuesta a eliminar
 */
const confirmDeleteResponse = (response: SurveyResponse) => {
  selectedResponse.value = response
  showDeleteModal.value = true
}

/**
 * Elimina la respuesta seleccionada
 */
const deleteResponse = async () => {
  if (!selectedResponse.value) return

  try {
    await responseService.deleteResponse(selectedResponse.value.id)

    // Remover de la lista local
    responses.value = responses.value.filter(r => r.id !== selectedResponse.value!.id)

    // Actualizar estadísticas
    if (stats.value) {
      stats.value.totalResponses--
    }

    showDeleteModal.value = false
    selectedResponse.value = null

  } catch (err: any) {
    console.error('Error deleting response:', err)
    error.value = 'Error al eliminar la respuesta'
  }
}

/**
 * Formatea una fecha para mostrar
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatea tiempo en minutos
 * @param minutes - Minutos a formatear
 * @returns Tiempo formateado
 */
const formatTime = (minutes?: number): string => {
  if (!minutes) return 'N/A'
  if (minutes < 1) return '< 1 min'
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return `${hours}h ${mins}min`
}

// Watchers
watch(() => filteredResponses.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

// Lifecycle
onMounted(async () => {
  // Cargar encuestas si no están cargadas
  if (surveys.value.length === 0) {
    await surveyStore.fetchSurveys()
  }
  
  const surveyFromQuery = route.query.survey as string
  if (surveyFromQuery) {
    selectedSurveyId.value = surveyFromQuery
    await loadResponsesForSurvey()
  }
})
</script>

<style scoped>
.response-view {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.response-header {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
}

.header-info h1 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  font-size: 1.75rem;
}

.survey-title {
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.survey-selector {
  min-width: 250px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-primary);
}

.export-btn {
  background: var(--success-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.export-btn:hover:not(:disabled) {
  background: var(--success-hover);
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stats-section {
  margin-bottom: var(--spacing-lg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.stat-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.filters-section {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow);
}

.filters {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.search-input,
.date-filter {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-primary);
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.clear-filters-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-lg) auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.empty-icon,
.error-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.retry-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  cursor: pointer;
  margin-top: var(--spacing-md);
}

.responses-section {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
}

.responses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.responses-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.view-options {
  display: flex;
  gap: var(--spacing-xs);
}

.view-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.responses-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.response-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  transition: box-shadow 0.2s ease;
}

.response-card:hover {
  box-shadow: var(--shadow);
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.response-info {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.response-id {
  font-family: 'Courier New', monospace;
  background: var(--bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.85rem;
}

.response-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.response-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.8rem;
  transition: opacity 0.2s ease;
}

.view-btn-small {
  background: var(--info-color);
  color: white;
}

.delete-btn-small {
  background: var(--error-color);
  color: white;
}

.action-btn:hover {
  opacity: 0.8;
}

.response-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.page-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .response-view {
    padding: var(--spacing-md);
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .survey-selector {
    min-width: unset;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .responses-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .response-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
  }

  .response-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .pagination {
    flex-direction: column;
  }
}
</style>