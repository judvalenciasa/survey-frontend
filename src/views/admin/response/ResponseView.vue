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
        <header class="response-header">
            <div class="header-content">
                <h1 class="page-title">Respuestas de Encuestas</h1>

                <div class="survey-selector-container">
                    <label for="survey-select" class="selector-label">Seleccionar Encuesta:</label>
                    <select id="survey-select" v-model="selectedSurveyId" class="survey-select" @change="loadResponses"
                        :disabled="loadingSurveys">
                        <option value="">-- Selecciona una encuesta --</option>
                        <option v-for="survey in surveys" :key="survey.id" :value="survey.id">
                            {{ survey.name }} ({{ survey.status }})
                        </option>
                    </select>
                </div>
            </div>
        </header>

        <!-- Estados de carga y error -->
        <div v-if="loadingSurveys" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Cargando encuestas...</p>
        </div>

        <div v-else-if="errorMessage" class="error-state">
            <div class="error-icon">❌</div>
            <h3>Error</h3>
            <p>{{ errorMessage }}</p>
            <button @click="loadSurveys" class="retry-btn">Reintentar</button>
        </div>

        <!-- Área principal de respuestas -->
        <main class="main-content">
            <!-- Sin encuesta seleccionada -->
            <div v-if="!selectedSurveyId" class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>Selecciona una encuesta</h3>
                <p>Elige una encuesta del menú desplegable para ver sus respuestas.</p>
            </div>

            <!-- Cargando respuestas -->
            <div v-else-if="loadingResponses" class="loading-state">
                <div class="loading-spinner"></div>
                <p>Cargando respuestas...</p>
            </div>

            <!-- Error al cargar respuestas -->
            <div v-else-if="responseError" class="error-state">
                <div class="error-icon">❌</div>
                <h3>Error al cargar respuestas</h3>
                <p>{{ responseError }}</p>
                <button @click="loadResponses" class="retry-btn">Reintentar</button>
            </div>

            <!-- Respuestas cargadas -->
            <div v-else-if="responses.length > 0" class="responses-container">
                <!-- Información básica -->
                <div class="info-section">
                    <div class="info-card">
                        <div class="info-number">{{ responses.length }}</div>
                        <div class="info-label">Total Respuestas</div>
                    </div>
                    <div class="info-card">
                        <div class="info-text">{{ selectedSurvey?.name || 'N/A' }}</div>
                        <div class="info-label">Encuesta Seleccionada</div>
                    </div>
                </div>

                <!-- Lista de respuestas -->
                <div class="responses-section">
                    <h2 class="section-title">Respuestas ({{ responses.length }})</h2>

                    <div class="responses-grid">
                        <div v-for="(response, index) in responses" :key="response.id" class="response-card">
                            <div class="response-header">
                                <div class="response-number">Respuesta #{{ index + 1 }}</div>
                                <div class="response-date">{{ formatDate(response.submittedAt) }}</div>
                            </div>

                            <div class="response-content">
                                <div class="response-id">ID: {{ response.id.slice(0, 8) }}...</div>

                                <div class="answers-list">
                                    <div v-for="answer in response.answers" :key="answer.questionId"
                                        class="answer-item">
                                        <div class="question-id">Pregunta: {{ answer.questionId.slice(0, 8) }}...</div>
                                        <div class="answer-value">{{ formatAnswer(answer.answer) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sin respuestas -->
            <div v-else-if="selectedSurveyId && !loadingResponses" class="empty-state">
                <div class="empty-icon">📄</div>
                <h3>Sin respuestas</h3>
                <p>Esta encuesta no tiene respuestas aún.</p>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSurveyStore } from '@/store/modules/survey'
import { responseService } from '@/services/response.service'
import type { Survey } from '@/types/survey'
import type { SurveyResponse } from '@/types/response'

// Store y estado reactivo
const surveyStore = useSurveyStore()
const selectedSurveyId = ref<string>('')
const responses = ref<SurveyResponse[]>([])
const loadingSurveys = ref(false)
const loadingResponses = ref(false)
const errorMessage = ref<string | null>(null)
const responseError = ref<string | null>(null)

// Computed properties
const surveys = computed(() => surveyStore.surveys)
const selectedSurvey = computed(() =>
    surveys.value.find(survey => survey.id === selectedSurveyId.value)
)

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
        return
    }

    loadingResponses.value = true
    responseError.value = null

    try {
        console.log(`📡 Cargando respuestas para encuesta: ${selectedSurveyId.value}`)
        const response = await responseService.getResponsesBySurvey(selectedSurveyId.value)
        responses.value = response.data
        console.log(`✅ ${responses.value.length} respuestas cargadas`)
    } catch (error: any) {
        console.error('❌ Error cargando respuestas:', error)
        responseError.value = error.response?.data?.message || 'Error al cargar las respuestas'
        responses.value = []
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

// Lifecycle
onMounted(async () => {
    console.log('🚀 Iniciando ResponseView...')
    await loadSurveys()
})
</script>

<style scoped>
.response-view {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
}

.response-header {
    background: var(--bg-primary);
    border-radius: var(--border-radius);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    box-shadow: var(--shadow);
}

.header-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.survey-selector-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.selector-label {
    font-weight: 600;
    color: var(--text-primary);
}

.survey-select {
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-width: 300px;
}

.survey-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary-color);
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
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
}

.retry-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius);
    cursor: pointer;
    margin-top: var(--spacing-md);
    transition: background-color 0.2s;
}

.retry-btn:hover {
    background: var(--primary-hover);
}

.main-content {
    background: var(--bg-primary);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    overflow: hidden;
}

.info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
}

.info-card {
    background: var(--bg-primary);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    text-align: center;
    box-shadow: var(--shadow);
}

.info-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
}

.info-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    word-break: break-word;
}

.info-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.responses-section {
    padding: var(--spacing-xl);
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
}

.responses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-lg);
}

.response-card {
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
    border: 1px solid var(--border-color);
    transition: transform 0.2s, box-shadow 0.2s;
}

.response-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.response-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
}

.response-number {
    font-weight: 600;
    color: var(--primary-color);
}

.response-date {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.response-id {
    font-size: 0.8rem;
    color: var(--text-tertiary);
    margin-bottom: var(--spacing-md);
    font-family: 'Courier New', monospace;
}

.answers-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.answer-item {
    background: var(--bg-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    border-left: 3px solid var(--primary-color);
}

.question-id {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-bottom: var(--spacing-xs);
}

.answer-value {
    color: var(--text-primary);
    font-weight: 500;
    word-break: break-word;
}

@media (max-width: 768px) {
    .response-view {
        padding: var(--spacing-md);
    }

    .header-content {
        gap: var(--spacing-md);
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
}
</style>