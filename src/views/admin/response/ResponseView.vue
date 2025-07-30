<!--
/**
 * Vista de gestión de respuestas de encuestas
 * @description Página administrativa para visualizar respuestas de encuestas
 * @view ResponseView
 */
-->
<template>
  <div class="response-view">
    <!-- Header con selector de encuestas -->
    <header class="response-header card">
      <div class="flex flex-col gap-lg">
        <h1 class="page-title">
          Respuestas de Encuestas
        </h1>

        <div class="survey-selector-container">
          <label
            for="survey-select"
            class="form-label"
          >Seleccionar Encuesta:</label>
          <select
            id="survey-select"
            v-model="selectedSurveyId"
            class="form-input survey-select"
            :disabled="loadingSurveys"
            @change="loadResponses"
          >
            <option value="">
              -- Selecciona una encuesta --
            </option>
            <option
              v-for="survey in surveys"
              :key="survey.id"
              :value="survey.id"
            >
              {{ survey.name }} ({{ survey.status }})
            </option>
          </select>
        </div>
      </div>
    </header>

    <!-- Estados de carga y error -->
    <div
      v-if="loadingSurveys"
      class="loading-state card"
    >
      <div class="loading-spinner" />
      <p class="text-secondary">
        Cargando encuestas...
      </p>
    </div>

    <div
      v-else-if="errorMessage"
      class="error-state card"
    >
      <div class="error-icon">
        ❌
      </div>
      <h3 class="text-primary">
        Error
      </h3>
      <p class="text-secondary">
        {{ errorMessage }}
      </p>
      <button
        class="btn btn-primary"
        @click="loadSurveys"
      >
        Reintentar
      </button>
    </div>

    <!-- Área principal de respuestas -->
    <main class="main-content">
      <!-- Sin encuesta seleccionada -->
      <div
        v-if="!selectedSurveyId"
        class="empty-state card"
      >
        <div class="empty-icon">
          📋
        </div>
        <h3 class="text-primary">
          Selecciona una encuesta
        </h3>
        <p class="text-secondary">
          Elige una encuesta del menú desplegable para ver sus respuestas.
        </p>
      </div>

      <!-- Cargando respuestas -->
      <div
        v-else-if="loadingResponses"
        class="loading-state card"
      >
        <div class="loading-spinner" />
        <p class="text-secondary">
          Cargando respuestas...
        </p>
      </div>

      <!-- Error al cargar respuestas -->
      <div
        v-else-if="responseError"
        class="error-state card"
      >
        <div class="error-icon">
          ❌
        </div>
        <h3 class="text-primary">
          Error al cargar respuestas
        </h3>
        <p class="text-secondary">
          {{ responseError }}
        </p>
        <button
          class="btn btn-primary"
          @click="loadResponses"
        >
          Reintentar
        </button>
      </div>

      <!-- Respuestas cargadas -->
      <div
        v-else-if="responses.length > 0 && selectedSurveyData"
        class="responses-container"
      >
        <!-- Información básica -->
        <div class="info-section">
          <div class="info-card card">
            <div class="info-icon">
              📊
            </div>
            <div class="info-content">
              <div class="info-number">
                {{ responses.length }}
              </div>
              <div class="info-label">
                Total Respuestas
              </div>
            </div>
          </div>
          <div class="info-card card">
            <div class="info-icon">
              📋
            </div>
            <div class="info-content">
              <div class="info-text">
                {{ selectedSurveyData.name }}
              </div>
              <div class="info-label">
                {{ selectedSurveyData.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de respuestas -->
        <div class="responses-section card">
          <div class="flex items-center justify-between mb-md">
            <h2 class="section-title">
              Respuestas ({{ responses.length }})
            </h2>
            <button 
              v-if="responses.length > 0"
              @click="exportToCSV"
              class="btn btn-secondary export-btn"
            >
              📊 Exportar CSV
            </button>
          </div>

          <div class="responses-grid">
            <div
              v-for="(response, index) in responses"
              :key="response.id"
              class="response-card"
            >
              <div class="response-header flex items-center justify-between">
                <div class="response-number">
                  <span class="number-badge">#{{ index + 1 }}</span>
                </div>
                <div class="response-date text-secondary">
                  {{ formatDate(response.submittedAt) }}
                </div>
              </div>

              <div class="response-content">
                <div class="answers-list">
                  <div
                    v-for="answer in response.answers"
                    :key="answer.questionId"
                    class="answer-item"
                  >
                    <div class="question-content">
                      <div class="question-text">
                        {{ getQuestionText(answer.questionId) }}
                      </div>
                      <div class="answer-value">
                        {{ formatAnswer(answer.answer) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin respuestas -->
      <div
        v-else-if="selectedSurveyId && !loadingResponses"
        class="empty-state card"
      >
        <div class="empty-icon">
          📄
        </div>
        <h3 class="text-primary">
          Sin respuestas
        </h3>
        <p class="text-secondary">
          Esta encuesta no tiene respuestas aún.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSurveyStore } from '../../../store/modules/survey'
import { responseService } from '../../../services/response.service'
import { surveyService } from '../../../services/survey.service'
import type { Survey } from '../../../types/survey'
import type { SurveyResponse } from '../../../types/response'

// Route y store
const route = useRoute()
const surveyStore = useSurveyStore()

// Estado reactivo
const selectedSurveyId = ref<string>('')
const responses = ref<SurveyResponse[]>([])
const selectedSurveyData = ref<Survey | null>(null)
const loadingSurveys = ref(false)
const loadingResponses = ref(false)
const errorMessage = ref<string | null>(null)
const responseError = ref<string | null>(null)

// Computed properties
const surveys = computed(() => surveyStore.surveys)

/**
 * Obtiene el texto de una pregunta por su ID
 */
const getQuestionText = (questionId: string): string => {
    if (!selectedSurveyData.value?.questions) return 'Pregunta no encontrada'
    
    const question = selectedSurveyData.value.questions.find(q => q.id === questionId)
    return question?.text || `Pregunta (${questionId.slice(0, 8)}...)`
}

/**
 * Carga las encuestas disponibles
 */
const loadSurveys = async () => {
    loadingSurveys.value = true
    errorMessage.value = null

    try {
        await surveyStore.fetchSurveys()
        console.log(`✅ ${surveys.value.length} encuestas cargadas`)
    } catch (error: any) {
        console.error('❌ Error cargando encuestas:', error)
        errorMessage.value = error.response?.data?.message || 'Error al cargar las encuestas'
    } finally {
        loadingSurveys.value = false
    }
}

/**
 * Carga las respuestas de la encuesta seleccionada
 */
const loadResponses = async () => {
    if (!selectedSurveyId.value) {
        responses.value = []
        selectedSurveyData.value = null
        return
    }

    loadingResponses.value = true
    responseError.value = null

    try {
        console.log(`📡 Cargando respuestas para encuesta: ${selectedSurveyId.value}`)
        
        // Cargar respuestas y datos de la encuesta en paralelo
        const [responsesRes, surveyRes] = await Promise.all([
            responseService.getResponsesBySurvey(selectedSurveyId.value),
            surveyService.getSurvey(selectedSurveyId.value)
        ])
        
        responses.value = responsesRes.data
        selectedSurveyData.value = surveyRes.data
        
        console.log(`✅ ${responses.value.length} respuestas cargadas`)
        console.log(`✅ Encuesta cargada: ${selectedSurveyData.value.name}`)
    } catch (error: any) {
        console.error('❌ Error cargando respuestas:', error)
        responseError.value = error.response?.data?.message || 'Error al cargar las respuestas'
        responses.value = []
        selectedSurveyData.value = null
    } finally {
        loadingResponses.value = false
    }
}

/**
 * Formatea una fecha para mostrar
 */
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString)
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return dateString
    }
}

/**
 * Formatea una respuesta para mostrar
 */
const formatAnswer = (answer: any): string => {
    if (Array.isArray(answer)) {
        return answer.join(', ')
    }
    if (typeof answer === 'boolean') {
        return answer ? 'Sí' : 'No'
    }
    if (typeof answer === 'object' && answer !== null) {
        return JSON.stringify(answer)
    }
    return String(answer)
}

/**
 * Exporta las respuestas a CSV
 */
const exportToCSV = () => {
    if (!responses.value.length || !selectedSurveyData.value) {
        alert('No hay datos para exportar')
        return
    }

    // Crear headers del CSV
    const headers = ['Respuesta #', 'Fecha de Envío']
    
    // Agregar preguntas como headers
    selectedSurveyData.value.questions.forEach(question => {
        headers.push(`"${question.text}"`)
    })

    // Crear filas de datos
    const csvData = [headers.join(',')]
    
    responses.value.forEach((response, index) => {
        const row = [
            `#${index + 1}`,
            `"${formatDate(response.submittedAt)}"`
        ]
        
        // Agregar respuestas para cada pregunta
        selectedSurveyData.value!.questions.forEach(question => {
            const answer = response.answers.find(a => a.questionId === question.id)
            const formattedAnswer = answer ? formatAnswer(answer.answer) : 'Sin respuesta'
            row.push(`"${formattedAnswer.replace(/"/g, '""')}"`) // Escapar comillas
        })
        
        csvData.push(row.join(','))
    })

    // Crear y descargar archivo
    const csvContent = csvData.join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }) // UTF-8 BOM
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `respuestas_${selectedSurveyData.value.name}_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        console.log('✅ CSV exportado exitosamente')
    }
}

// Lifecycle
onMounted(async () => {
    console.log('🚀 Iniciando ResponseView...')
    await loadSurveys()
    
    // Auto-seleccionar encuesta si viene por parámetro
    const surveyParam = route.query.survey as string
    if (surveyParam) {
        console.log(`🎯 Auto-seleccionando encuesta: ${surveyParam}`)
        selectedSurveyId.value = surveyParam
        await loadResponses()
    }
})
</script>

<style scoped>
.response-view {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--bg-secondary);
}

.response-header {
    margin-bottom: var(--spacing-xl);
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.page-title::before {
    content: "📊";
    font-size: 1.5rem;
}

.survey-select {
    min-width: 350px;
    font-weight: 500;
}

.loading-state,
.error-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--spacing-2xl);
    margin: var(--spacing-xl) 0;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--secondary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-lg);
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-icon,
.empty-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
}

.info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.info-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    border-left: 4px solid var(--secondary-color);
    transition: transform 0.2s, box-shadow 0.2s;
}

.info-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.info-icon {
    font-size: 2.5rem;
    opacity: 0.8;
}

.info-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--secondary-color);
    margin-bottom: var(--spacing-xs);
}

.info-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
    word-break: break-word;
}

.info-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
}

.responses-section {
    padding: var(--spacing-xl);
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.responses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: var(--spacing-lg);
}

.response-card {
    background: var(--bg-primary);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.response-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.response-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--secondary-color);
}

.response-header {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
}

.number-badge {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-weight: 600;
    font-size: 0.9rem;
}

.response-date {
    font-size: 0.85rem;
    font-weight: 500;
}

.answers-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.answer-item {
    background: var(--bg-secondary);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    border-left: 4px solid var(--secondary-color);
    transition: background 0.2s;
}

.answer-item:hover {
    background: var(--bg-primary);
    box-shadow: var(--shadow);
}

.question-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.question-text {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: var(--spacing-sm);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
}

.answer-value {
    color: var(--text-secondary);
    font-weight: 500;
    font-size: 1.1rem;
    word-break: break-word;
    line-height: 1.6;
    background: var(--bg-primary);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  background: var(--primary-color);
  transform: translateY(-1px);
}

.export-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
    .response-view {
        padding: var(--spacing-md);
    }

    .page-title {
        font-size: 1.5rem;
    }

    .survey-select {
        min-width: auto;
        width: 100%;
    }

    .responses-grid {
        grid-template-columns: 1fr;
    }

    .info-section {
        grid-template-columns: 1fr;
    }

    .info-card {
        flex-direction: column;
        text-align: center;
    }
}

/* Animaciones suaves */
.response-card,
.answer-item,
.info-card {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Estados focus mejorados */
.survey-select:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(111, 207, 151, 0.1);
}
</style>