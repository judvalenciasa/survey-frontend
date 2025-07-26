<template>
  <div class="survey-response-page">
    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando encuesta...</p>
    </div>

    <!-- Error al cargar -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h2>Error al cargar la encuesta</h2>
      <p>{{ error }}</p>
      <button @click="$router.push('/survey-presentation')" class="btn-secondary">
        Volver a intentar
      </button>
    </div>

    <!-- Formulario de respuesta -->
    <div v-else-if="survey && !submitted" class="survey-container">
      <div class="survey-header">
        <h1 class="survey-title">{{ survey.name }}</h1>
        <p class="survey-description">{{ survey.description }}</p>
        <div class="survey-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <span class="progress-text">
            {{ answeredQuestions }} de {{ survey.questions.length }} preguntas respondidas
          </span>
        </div>
      </div>

      <form @submit.prevent="submitSurvey" class="survey-form">
        <QuestionRender
          v-for="question in survey.questions"
          :key="question.id"
          :question="question"
          v-model="responses[question.id]"
        />

        <!-- Error de validación -->
        <div v-if="validationError" class="validation-error">
          {{ validationError }}
        </div>

        <!-- Botones de acción -->
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="submitting"
          >
            <span v-if="submitting">Enviando...</span>
            <span v-else>Enviar Respuestas</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Estado enviado -->
    <div v-else-if="submitted" class="success-state">
      <div class="success-icon">✅</div>
      <h2>¡Respuestas enviadas exitosamente!</h2>
      <p>Gracias por participar en nuestra encuesta.</p>
      <button @click="$router.push('/')" class="btn-primary">
        Volver al inicio
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { surveyService } from '@/services/survey.service'
import type { Survey } from '@/types/survey'
import QuestionRender from '@/components/survey/QuestionRender.vue'

const router = useRouter()
const route = useRoute()

// Estado
const loading = ref(true)
const error = ref('')
const survey = ref<Survey | null>(null)
const responses = ref<Record<string, any>>({})
const submitting = ref(false)
const submitted = ref(false)
const validationError = ref('')

// Computadas
const answeredQuestions = computed(() => {
  if (!survey.value) return 0
  return survey.value.questions.filter(q => {
    const answer = responses.value[q.id]
    return answer !== undefined && answer !== '' && answer !== null
  }).length
})

const progressPercentage = computed(() => {
  if (!survey.value) return 0
  return Math.round((answeredQuestions.value / survey.value.questions.length) * 100)
})

// Métodos
const loadSurvey = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // ✨ CAMBIO: Usar 'id' en lugar de 'code' y el método correcto
    const surveyId = route.params.id as string
    console.log('Loading survey with ID:', surveyId) // Para debugging
    
    const response = await surveyService.getSurveyForResponse(surveyId)
    survey.value = response.data
    
    // Verificar que la encuesta está publicada
    if (survey.value.status !== 'PUBLICADA') {
      throw new Error('Esta encuesta no está disponible para responder')
    }
    
    // Inicializar respuestas vacías
    survey.value.questions.forEach(question => {
      responses.value[question.id] = question.type === 'MULTIPLE_CHOICE' ? [] : ''
    })
    
  } catch (err: any) {
    console.error('Error loading survey:', err)
    
    if (err.response?.status === 404) {
      error.value = 'Encuesta no encontrada'
    } else if (err.response?.status === 403) {
      error.value = 'Esta encuesta no está disponible para responder'
    } else {
      error.value = err.message || 'No se pudo cargar la encuesta'
    }
  } finally {
    loading.value = false
  }
}

const validateResponses = (): boolean => {
  if (!survey.value) return false
  
  validationError.value = ''
  
  // Verificar preguntas obligatorias
  const missingQuestions = survey.value.questions.filter(question => {
    if (!question.required) return false
    
    const answer = responses.value[question.id]
    
    if (question.type === 'MULTIPLE_CHOICE') {
      return !Array.isArray(answer) || answer.length === 0
    }
    
    return answer === undefined || answer === '' || answer === null
  })
  
  if (missingQuestions.length > 0) {
    validationError.value = `Por favor responde todas las preguntas obligatorias (faltan ${missingQuestions.length})`
    return false
  }
  
  return true
}

const submitSurvey = async () => {
  if (!validateResponses()) return
  
  try {
    submitting.value = true
    validationError.value = ''
    
    // ✨ CAMBIO: Usar 'id' en lugar de 'code'
    const surveyId = route.params.id as string
    console.log('Submitting responses for survey ID:', surveyId) // Para debugging
    
    await surveyService.submitResponse(surveyId, responses.value)
    
    submitted.value = true
    
    // Opcional: Redirigir a página de agradecimiento después de un delay
    setTimeout(() => {
      router.push('/thank-you')
    }, 2000)
    
  } catch (err: any) {
    console.error('Error submitting responses:', err)
    validationError.value = err.response?.data?.message || 'Error al enviar las respuestas'
  } finally {
    submitting.value = false
  }
}

// Ciclo de vida
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
