<template>
  <div class="survey-public">
    <div class="survey-container">
      <div class="survey-header">
        <h1 class="survey-title">
          Acceso a Encuesta
        </h1>
        <p class="survey-subtitle">
          Ingresa el ID de la encuesta para comenzar
        </p>
      </div>

      <form
        class="survey-form"
        @submit.prevent="accessSurvey"
      >
        <input
          v-model="surveyId"
          type="text"
          placeholder="Ingresa el ID de la encuesta"
          class="survey-input"
          :class="{ error: error }"
          :disabled="loading"
        >
        
        <p
          v-if="error"
          class="error-message"
        >
          {{ error }}
        </p>

        <button 
          type="submit" 
          class="access-btn"
          :disabled="loading || !surveyId"
        >
          {{ loading ? 'Verificando...' : 'Acceder' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { surveyService } from '../../services/survey.service'

const router = useRouter()
const surveyId = ref('')  // ✨ CAMBIO: Usar surveyId en lugar de surveyCode
const loading = ref(false)
const error = ref('')

const accessSurvey = async () => {
  if (!surveyId.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    // ✨ CAMBIO: Usar getSurveyForResponse en lugar de getSurveyByCode
    const response = await surveyService.getSurveyForResponse(surveyId.value)
    
    // Verificar que la encuesta está publicada
    if (response.data.status !== 'PUBLICADA') {
      throw new Error('Esta encuesta no está disponible para responder')
    }
    
    // Si llegamos aquí, la encuesta existe y está activa - navegar a responder
    router.push(`/survey/${surveyId.value}`)
    
  } catch (err: any) {
    console.error('Error accessing survey:', err)
    
    if (err.response?.status === 404) {
      error.value = 'Encuesta no encontrada'
    } else if (err.response?.status === 403) {
      error.value = 'Esta encuesta no está disponible para responder'
    } else {
      error.value = err.message || 'ID de encuesta no válido'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.survey-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  background: var(--bg-secondary);
}

.survey-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.survey-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.survey-subtitle {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.survey-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.survey-input {
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  text-align: center;
  transition: border-color 0.2s ease;
}

.survey-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.survey-input.error {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: 0.9rem;
  margin-top: -var(--spacing-sm);
}

.survey-button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.survey-button:hover:not(:disabled) {
  background: var(--primary-hover);
}

.survey-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
