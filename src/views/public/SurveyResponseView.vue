<!--
/**
 * Vista para responder encuestas públicas
 * @description Página interactiva para responder preguntas de encuesta con progreso
 * @view SurveyResponseView
 */
-->
<template>
  <div class="survey-response-page">
    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner" />
      <p>Cargando encuesta...</p>
    </div>

    <!-- Error al cargar -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        ❌
      </div>
      <h2>Error al cargar la encuesta</h2>
      <p>{{ error }}</p>
      <button class="btn-secondary" @click="$router.push('/survey-presentation')">
        Volver a intentar
      </button>
    </div>

    <!-- Formulario de respuesta -->
    <div v-else-if="survey && !submitted" class="survey-container">
      <div class="survey-header">
        <h1 class="survey-title">
          {{ survey.name }}
        </h1>
        <p class="survey-description">
          {{ survey.description }}
        </p>
        <div class="survey-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPercentage}%` }" />
          </div>
          <span class="progress-text">
            {{ answeredQuestions }} de {{ survey.questions.length }} preguntas respondidas
          </span>
        </div>
      </div>

      <div class="questions-container">
        <QuestionRender v-for="question in survey.questions" :key="question.id" :question="question"
          :model-value="responses[question.id]" @update:model-value="updateResponse(question.id, $event)" />
      </div>

      <!-- Error de validación -->
      <div v-if="error" class="validation-error">
        {{ error }}
      </div>

      <div class="submit-section">
        <button class="submit-btn" :disabled="loading" @click="submitResponses">
          <span v-if="loading">Enviando...</span>
          <span v-else>Enviar Respuestas</span>
        </button>
      </div>
    </div>

    <!-- Estado enviado -->
    <div v-else-if="submitted" class="success-state">
      <div class="success-icon">
        ✅
      </div>
      <h2>¡Respuestas enviadas exitosamente!</h2>
      <p>Gracias por participar en nuestra encuesta.</p>
      <button class="btn-primary" @click="$router.push('/')">
        Volver al inicio
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { surveyService } from '../../services/survey.service'
import type { Survey } from '../../types/survey'
import QuestionRender from '../../components/survey/QuestionRender.vue'

const route = useRoute()
const router = useRouter()

const survey = ref<Survey | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const responses = ref<Record<string, any>>({})
const submitted = ref(false)

/**
 * Calcula el número de preguntas respondidas
 */
const answeredQuestions = computed(() => {
  return Object.keys(responses.value).length
})

/**
 * Calcula el porcentaje de progreso de la encuesta
 */
const progressPercentage = computed(() => {
  if (!survey.value) return 0
  return Math.round((answeredQuestions.value / survey.value.questions.length) * 100)
})

/**
 * Carga los datos de la encuesta desde el servidor
 */
const loadSurvey = async () => {
  loading.value = true
  error.value = null

  try {
    const surveyId = route.params.id as string
    const response = await surveyService.getSurveyForResponse(surveyId)
    survey.value = response.data

    if (survey.value.status !== 'PUBLICADA') {
      error.value = 'Esta encuesta no está disponible para responder'
      return
    }

    survey.value.questions.forEach(question => {
      responses.value[question.id] = null
    })

  } catch (err: any) {
    console.error('Error cargando encuesta:', err)
    error.value = err.response?.data?.message || 'Error al cargar la encuesta'
  } finally {
    loading.value = false
  }
}

/**
 * Actualiza la respuesta de una pregunta específica
 * @param questionId - ID de la pregunta
 * @param value - Valor de la respuesta
 */
const updateResponse = (questionId: string, value: any) => {
  responses.value[questionId] = value
}

/**
 * Valida que todas las preguntas obligatorias estén respondidas
 * @returns true si todas las preguntas obligatorias están respondidas
 */
const validateResponses = (): boolean => {
  if (!survey.value) return false

  const missingResponses = survey.value.questions
    .filter(question => question.required)
    .filter(question => {
      const response = responses.value[question.id]
      return response === null || response === undefined || response === '' ||
        (Array.isArray(response) && response.length === 0)
    })

  if (missingResponses.length > 0) {
    error.value = `Por favor complete todas las preguntas obligatorias: ${missingResponses.map(q => q.text).join(', ')}`
    return false
  }

  return true
}

/**
 * Envía las respuestas de la encuesta
 */
const submitResponses = async () => {
  if (!validateResponses()) return
  if (!survey.value) return

  loading.value = true
  try {
    await surveyService.submitResponse(survey.value.id, responses.value)
    submitted.value = true
    router.push('/thank-you')
  } catch (err: any) {
    console.error('Error enviando respuestas:', err)
    error.value = err.response?.data?.message || 'Error al enviar las respuestas'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSurvey()
})
</script>

<style scoped>
.survey-response-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: var(--spacing-xl);
}

.loading-state,
.error-state,
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
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
.success-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.survey-container {
  max-width: 800px;
  margin: 0 auto;
}

.survey-header {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow);
}

.survey-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.survey-description {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.survey-progress {
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.survey-form {
  width: 100%;
}

.validation-error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-2xl);
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

@media (max-width: 768px) {
  .survey-response-page {
    padding: var(--spacing-lg);
  }

  .survey-header {
    padding: var(--spacing-lg);
  }

  .survey-title {
    font-size: 1.5rem;
  }
}
</style>
