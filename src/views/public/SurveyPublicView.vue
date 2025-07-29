<!--
/**
 * Vista de acceso público a encuestas
 * @description Página para ingresar ID de encuesta y acceder a responderla
 * @view SurveyPublicView
 */
-->
<template>
  <!--
    Vista Pública de Acceso a Encuestas
  -->
  <div class="survey-public">
    <div class="survey-container">
      <div class="survey-header">
        <h1 class="survey-title">
          Acceso a Encuesta
        </h1>
      </div>

      <form
        class="survey-form"
        @submit.prevent="accessSurvey"
      >
        <input
          v-model="surveyId"
          type="text"
          placeholder="Número de encuesta"
          class="survey-input"
          :class="{ error: error }"
          :disabled="loading"
          autocomplete="off" 
          spellcheck="false"
          maxlength="70"
          @input="clearError"
        >

        <div
          v-if="error"
          class="error-message"
          :class="getErrorClass(error)"
        >
          <div class="error-icon">
            {{ getErrorIcon(error) }}
          </div>
          <div class="error-text">
            {{ error }}
          </div>
        </div>

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

/** Router de Vue para navegación programática */
const router = useRouter()

/**
 * ID de la encuesta ingresado por el usuario
 */
const surveyId = ref('')

/**
 * Indica si hay una operación de verificación en progreso
 */
const loading = ref(false)

/**
 * Mensaje de error a mostrar al usuario
 */
const error = ref('')

/**
 * Limpia el mensaje de error cuando el usuario escribe
 */
const clearError = () => {
  if (error.value) {
    error.value = ''
  }
}

const accessSurvey = async () => {
  if (!surveyId.value) {
    error.value = 'Por favor ingresa un ID de encuesta'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await surveyService.getSurveyForResponse(surveyId.value)
    
    // ✅ MEJORADO: Verificar el estado y dar mensaje específico
    if (response.data.status !== 'PUBLICADA') {
      // La encuesta existe pero no está publicada
      const statusMessages = {
        'CREADA': 'Esta encuesta aún no ha sido publicada',
        'CERRADA': 'Esta encuesta ya ha sido cerrada y no acepta más respuestas',
        'FINALIZADA': 'Esta encuesta ha finalizado y no acepta respuestas'
      }
      
      const statusMessage = statusMessages[response.data.status as keyof typeof statusMessages] || 
                           `Esta encuesta está en estado "${response.data.status}" y no está disponible para responder`
      
      error.value = statusMessage
      return // ✅ IMPORTANTE: No lanzar excepción, solo mostrar error
    }

    // Si llegamos aquí, la encuesta está PUBLICADA
    router.push(`/survey/${surveyId.value}`)

  } catch (err: any) {
    console.error('Error accessing survey:', err)

    // ✅ MEJORADO: Mensajes más específicos según el error
    if (err.response?.status === 404) {
      error.value = 'La encuesta no existe o no está publicada'
    } else if (err.response?.status === 403) {
      error.value = 'No tienes permisos para acceder a esta encuesta'
    } else if (err.response?.status === 500) {
      error.value = 'Error del servidor. Por favor intenta nuevamente más tarde.'
    } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
      error.value = 'No se puede conectar al servidor. Verifica tu conexión a internet.'
    } else {
      error.value = err.message || 'Error al acceder a la encuesta. Intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}

/**
 * Obtiene la clase CSS según el tipo de error
 */
const getErrorClass = (errorMessage: string) => {
  if (errorMessage.includes('no ha sido publicada')) return 'error-warning'
  if (errorMessage.includes('cerrada') || errorMessage.includes('finalizado')) return 'error-info'
  if (errorMessage.includes('No se encontró')) return 'error-danger'
  return 'error-default'
}

/**
 * Obtiene el icono según el tipo de error
 */
const getErrorIcon = (errorMessage: string) => {
  if (errorMessage.includes('no ha sido publicada')) return '⏳'
  if (errorMessage.includes('cerrada') || errorMessage.includes('finalizado')) return '🔒'
  if (errorMessage.includes('No se encontró')) return '❌'
  if (errorMessage.includes('servidor')) return '��'
  return '⚠️'
}

</script>

<style scoped>
.survey-public {
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
  line-height: 1.6;
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.survey-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.survey-input.error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.survey-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--bg-disabled, #f9fafb);
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  margin-top: var(--spacing-sm);
  font-size: 0.9rem;
  border-left: 4px solid;
}

.error-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.error-text {
  flex: 1;
}

.error-danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border-left-color: #dc2626;
}

.error-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border-left-color: #d97706;
}

.error-info {
  background-color: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border-left-color: #2563eb;
}

.error-default {
  background-color: rgba(107, 114, 128, 0.1);
  color: #4b5563;
  border-left-color: #4b5563;
}

.access-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
}

.access-btn:hover:not(:disabled) {
  background: var(--primary-hover, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.access-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.access-btn:disabled.loading {
  position: relative;
}

@media (max-width: 480px) {
  .survey-title {
    font-size: 2rem;
  }

  .survey-public {
    padding: var(--spacing-lg) var(--spacing-sm);
  }

  .survey-input,
  .access-btn {
    font-size: 0.9rem;
  }
}
</style>