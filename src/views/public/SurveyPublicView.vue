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

      <form class="survey-form" @submit.prevent="accessSurvey">
        <input v-model="surveyId" type="text" placeholder="Número de encuesta"
          class="survey-input" :class="{ error: error }" :disabled="loading" @input="filterAlphanumeric"
          @keydown="preventSpecialChars" @paste="handlePaste" autocomplete="off" spellcheck="false" maxlength="20">

        <p v-if="error" class="error-message">
          {{ error }}
        </p>

        <button type="submit" class="access-btn" :disabled="loading || !surveyId">
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
 * Filtra el input para permitir solo caracteres alfanuméricos
 * Se ejecuta cada vez que el usuario escribe
 * 
 * @param {Event} event - Evento de input
 */
const filterAlphanumeric = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, '')

  if (value !== alphanumericOnly) {
    surveyId.value = alphanumericOnly
    target.value = alphanumericOnly
  }

  if (error.value) {
    error.value = ''
  }
}

/**
 * Previene la escritura de caracteres especiales desde el teclado
 * 
 * @param {KeyboardEvent} event - Evento de teclado
 */
const preventSpecialChars = (event: KeyboardEvent) => {
  const controlKeys = [
    'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End', 'PageUp', 'PageDown'
  ]

  if (controlKeys.includes(event.key)) {
    return
  }

  if (event.ctrlKey || event.metaKey) {
    return 
  }

  const isAlphanumeric = /^[a-zA-Z0-9]$/.test(event.key)

  if (!isAlphanumeric) {
    event.preventDefault() 
  }
}

/**
 * Maneja el pegado de texto para filtrar caracteres especiales
 * 
 * @param {ClipboardEvent} event - Evento de pegado
 */
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  
  const pastedText = event.clipboardData?.getData('text') || ''
  const filteredText = pastedText.replace(/[^a-zA-Z0-9]/g, '')
  const finalText = filteredText.substring(0, 20)
  
  surveyId.value = finalText

  if (error.value) {
    error.value = ''
  }

  if (pastedText !== finalText) {
    console.info('Texto pegado fue filtrado. Solo se mantuvieron letras y números.')
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

    if (response.data.status !== 'PUBLICADA') {
      throw new Error('Esta encuesta no está disponible para responder')
    }

    router.push(`/survey/${surveyId.value}`)

  } catch (err: any) {
    console.error('Error accessing survey:', err)

    if (err.response?.status === 404) {
      error.value = 'Encuesta no encontrada. Verifica el ID ingresado.'
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
  color: var(--error-color);
  font-size: 0.9rem;
  margin-top: -var(--spacing-sm);
  text-align: left;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--error-color);
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