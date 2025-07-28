<!--
/**
 * Formulario completo para crear y editar encuestas
 * @description Maneja la creación/edición de encuestas con validación y gestión de preguntas
 * @component SurveyForm
 */
-->
<template>
  <form class="survey-form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <h3>Información General</h3>

     
      <div class="form-group">
        <label class="form-label">Nombre de la encuesta *</label>
        <input v-model="formData.name" type="text" class="form-input" :class="{ error: errors.name }"
          placeholder="Ej: Encuesta de Satisfacción Laboral 2025" required>
        <ValidationMessage v-if="errors.name" :message="errors.name" />
      </div>

      
      <div class="form-group">
        <label class="form-label">Descripción *</label>
        <textarea v-model="formData.description" class="form-textarea" :class="{ error: errors.description }"
          placeholder="Describe el propósito y objetivos de esta encuesta..." rows="4" required />
        <ValidationMessage v-if="errors.description" :message="errors.description" />
      </div>

      
      <div class="date-row">
        <div class="form-group">
          <label class="form-label">Fecha de apertura</label>
          <input v-model="formData.scheduledOpen" type="datetime-local" class="form-input" :min="minDate">
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de cierre</label>
          <input v-model="formData.scheduledClose" type="datetime-local" class="form-input"
            :min="formData.scheduledOpen || minDate">
        </div>
      </div>

  
      <div class="form-group">
        <label class="checkbox-label">
          <input v-model="formData.template" type="checkbox" class="form-checkbox">
          <span class="checkbox-text">Guardar como plantilla</span>
        </label>
      </div>
    </div>

    <div class="form-section">
      <div class="questions-header">
        <h3>Preguntas ({{ questions.length }})</h3>
        <button type="button" class="add-question-btn" @click="addQuestion">
          + Agregar Pregunta
        </button>
      </div>

      <div v-if="questions.length === 0" class="empty-questions">
        <div class="empty-icon">
          ❓
        </div>
        <p>No hay preguntas aún. Agrega la primera pregunta para comenzar.</p>
        <button type="button" class="add-question-btn" @click="addQuestion">
          Agregar Primera Pregunta
        </button>
      </div>

      <div v-else class="questions-list">
        <!-- Reemplaza la sección "COMPONENTE SIMPLE DE PREGUNTA" con esto: -->
        <div v-for="(question, index) in questions" :key="`simple-question-${index}`"
          style="border: 2px solid #007bff; padding: 20px; margin: 15px 0; border-radius: 8px; background: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #007bff;">
              🔹 Pregunta {{ question.order }}
            </h4>
            <button
              style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;"
              @click="removeQuestion(index)">
              🗑️ Eliminar
            </button>
          </div>

          <!-- Campo de texto -->
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Texto de la pregunta:</label>
            <input v-model="question.text" type="text" placeholder="Escribe el texto de tu pregunta..."
              style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          </div>

          <!-- Selector de tipo -->
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Tipo de pregunta:</label>
            <select v-model="question.type"
              style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"
              @change="onQuestionTypeChange(question, index)">
              <option value="TEXT">
                📝 Texto libre
              </option>
              <option value="SINGLE_CHOICE">
                🔘 Opción única
              </option>
              <option value="MULTIPLE_CHOICE">
                ☑️ Múltiple selección
              </option>
              <option value="YES_NO">
                ✅ Sí/No
              </option>
              <option value="SCALE">
                📊 Escala
              </option>
              <option value="NUMBER">
                📊 Número
              </option>
            </select>
          </div>

          <!-- ✨ OPCIONES PARA SINGLE_CHOICE Y MULTIPLE_CHOICE -->
          <div v-if="question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE'"
            style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 10px;">Opciones de respuesta:</label>

            <div v-for="(_option, optIndex) in getQuestionOptions(question)" :key="optIndex"
              style="display: flex; gap: 10px; margin-bottom: 8px; align-items: center;">
              <input v-model="getQuestionOptions(question)[optIndex]" type="text"
                :placeholder="`Opción ${optIndex + 1}`"
                style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                @input="updateQuestionOptions(question, index)">
              <button v-if="getQuestionOptions(question).length > 1"
                style="background: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;"
                @click="removeOption(question, optIndex)">
                ❌
              </button>
            </div>

            <button
              style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 5px;"
              @click="addOption(question)">
              + Agregar opción
            </button>
          </div>

          <!-- ✨ CONFIGURACIÓN PARA ESCALA -->
          <div v-if="question.type === 'SCALE'" style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 10px;">Configuración de escala:</label>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Mínimo:</label>
                <input v-model.number="getScaleOptions(question).min" type="number" min="1" max="10"
                  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  @input="updateScaleOptions(question, index)">
              </div>
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Máximo:</label>
                <input v-model.number="getScaleOptions(question).max" type="number" min="2" max="10"
                  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  @input="updateScaleOptions(question, index)">
              </div>
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Paso:</label>
                <input v-model.number="getScaleOptions(question).step" type="number" min="1"
                  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  @input="updateScaleOptions(question, index)">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Etiqueta mínima:</label>
                <input 
                  :value="getScaleOptions(question).labels?.[getScaleOptions(question).min?.toString() ?? '1'] ?? ''"
                  @input="updateScaleLabel(question, 'min', $event)"
                  type="text"
                  placeholder="Ej: Muy malo"
                  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Etiqueta máxima:</label>
                <input 
                  :value="getScaleOptions(question).labels?.[getScaleOptions(question).max?.toString() ?? '5'] ?? ''"
                  @input="updateScaleLabel(question, 'max', $event)"
                  type="text"
                  placeholder="Ej: Excelente"
                  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
            </div>
          </div>

          <!-- ✨ CONFIGURACIÓN PARA NUMBER -->
          <div v-if="question.type === 'NUMBER'" style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 10px;">Configuración de número:</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Mínimo:</label>
                <input v-model.number="getNumberOptions(question).min" type="number" min="0" max="1000"
                  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  @input="updateNumberOptions(question, index)">
              </div>
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Máximo:</label>
                <input v-model.number="getNumberOptions(question).max" type="number" min="1" max="1000"
                  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  @input="updateNumberOptions(question, index)">
              </div>
            </div>
          </div>

          <!-- Checkbox obligatoria -->
          <div>
            <label style="display: flex; align-items: center; gap: 8px;">
              <input v-model="question.required" type="checkbox">
              <span>❗ Pregunta obligatoria</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Error general -->
    <div v-if="generalError" class="form-error">
      {{ generalError }}
    </div>

    <!-- Botones de acción -->
    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="$emit('cancel')">
        Cancelar
      </button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <span v-if="loading">Creando...</span>
        <span v-else>Crear Encuesta</span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { ref, computed, nextTick, defineComponent } from 'vue'
import type { CreateSurveyRequest } from '../../types/survey'
import type { CreateQuestionRequest, ScaleOptions, NumberOptions } from '../../types/question'
import ValidationMessage from '../forms/ValidationMessage.vue'

export default defineComponent({
  name: 'SurveyForm',
  components: {
    ValidationMessage
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(_props, { emit }) {
    const formData = ref({
      name: '',
      description: '',
      scheduledOpen: '',
      scheduledClose: '',
      template: false
    })

    const questions = ref<CreateQuestionRequest[]>([])

    const errors = ref<Record<string, string>>({})
    const questionErrors = ref<Record<number, Record<string, string>>>({})
    const generalError = ref<string | null>(null)

    /**
     * Calcula la fecha mínima para los campos de fecha
     */
    const minDate = computed(() => {
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      return now.toISOString().slice(0, 16)
    })

    /**
     * Agrega una nueva pregunta al formulario
     */
    const addQuestion = () => {
      const newQuestion: CreateQuestionRequest = {
        text: '',
        type: 'TEXT',
        required: true,
        options: null,
        order: questions.value.length + 1
      }
      questions.value.push(newQuestion)
    }

    /**
     * Elimina una pregunta del formulario
     * @param index - Índice de la pregunta a eliminar
     */
    const removeQuestion = (index: number) => {
      questions.value.splice(index, 1)
      questions.value.forEach((question, idx) => {
        question.order = idx + 1
      })
      delete questionErrors.value[index]
    }

    /**
     * Maneja el cambio de tipo de pregunta
     * @param question - Pregunta a modificar
     * @param index - Índice de la pregunta
     */
    const onQuestionTypeChange = (question: CreateQuestionRequest, index: number) => {
      const type = question.type

      if (type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') {
        if (!Array.isArray(question.options)) {
          question.options = ['', '']
        }
      } else if (type === 'SCALE') {
        if (typeof question.options !== 'object' || Array.isArray(question.options)) {
          question.options = { min: 1, max: 5, step: 1, labels: {} }
        }
      } else if (type === 'NUMBER') {
        if (typeof question.options !== 'object' || Array.isArray(question.options) || 'labels' in (question.options || {})) {
          question.options = { min: 0, max: 100 }
        }
      } else {
        question.options = null
      }

      if (questionErrors.value[index]) {
        delete questionErrors.value[index]
      }
    }

    /**
     * Obtiene las opciones de una pregunta como array de strings
     * @param question - Pregunta de la cual obtener las opciones
     * @returns Array de opciones
     */
    const getQuestionOptions = (question: CreateQuestionRequest): string[] => {
      if (Array.isArray(question.options)) {
        return question.options
      }
      return ['', '']
    }

    /**
     * Actualiza las opciones de una pregunta
     * @param question - Pregunta a actualizar
     * @param index - Índice de la pregunta
     */
    const updateQuestionOptions = (question: CreateQuestionRequest, index: number) => {
      console.log('updateQuestionOptions', question, index)
    }

    /**
     * Agrega una nueva opción a una pregunta
     * @param question - Pregunta a la que agregar la opción
     */
    const addOption = (question: CreateQuestionRequest) => {
      if (Array.isArray(question.options)) {
        question.options.push('')
      }
    }

    /**
     * Elimina una opción de una pregunta
     * @param question - Pregunta de la que eliminar la opción
     * @param optionIndex - Índice de la opción a eliminar
     */
    const removeOption = (question: CreateQuestionRequest, optionIndex: number) => {
      if (Array.isArray(question.options) && question.options.length > 1) {
        question.options.splice(optionIndex, 1)
      }
    }

    /**
     * Obtiene las opciones de escala de una pregunta
     * @param question - Pregunta de la cual obtener las opciones
     * @returns Opciones de escala
     */
    const getScaleOptions = (question: CreateQuestionRequest): ScaleOptions => {
      if (
        question.options && 
        typeof question.options === 'object' && 
        !Array.isArray(question.options) && 
        'min' in question.options && 
        'labels' in question.options
      ) {
        const options = question.options as ScaleOptions
        // Asegurar que las propiedades requeridas existen
        return {
          min: options.min ?? 1,
          max: options.max ?? 5,
          step: options.step ?? 1,
          labels: options.labels ?? {}
        }
      }
      return { min: 1, max: 5, step: 1, labels: {} }
    }

    /**
     * Valida el formulario completo
     * @returns true si el formulario es válido
     */
    const validateForm = (): boolean => {
      errors.value = {}
      questionErrors.value = {}
      generalError.value = null

      if (!formData.value.name.trim()) {
        errors.value.name = 'El nombre de la encuesta es obligatorio'
      }

      if (!formData.value.description.trim()) {
        errors.value.description = 'La descripción es obligatoria'
      }

      if (formData.value.scheduledOpen && formData.value.scheduledClose) {
        const openDate = new Date(formData.value.scheduledOpen)
        const closeDate = new Date(formData.value.scheduledClose)

        if (closeDate <= openDate) {
          errors.value.scheduledClose = 'La fecha de cierre debe ser posterior a la de apertura'
        }
      }

      if (questions.value.length === 0) {
        generalError.value = 'Debe agregar al menos una pregunta'
        return false
      }

      questions.value.forEach((question, index) => {
        const questionValidationErrors: Record<string, string> = {}

        if (!question.text.trim()) {
          questionValidationErrors.text = 'El texto de la pregunta es obligatorio'
        }

        if (!question.type) {
          questionValidationErrors.type = 'Debe seleccionar un tipo de pregunta'
        }

        if (question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') {
          const options = question.options as string[]
          if (!options || options.length < 2 || options.some(opt => !opt.trim())) {
            questionValidationErrors.options = 'Debe proporcionar al menos 2 opciones válidas'
          }
        }

        if (question.type === 'SCALE') {
          const scaleOptions = question.options as any
          if (!scaleOptions || scaleOptions.min >= scaleOptions.max) {
            questionValidationErrors.options = 'Configuración de escala inválida'
          }
        }

        if (question.type === 'NUMBER') {
          const numberOptions = question.options as NumberOptions
          if (!numberOptions || numberOptions.min >= numberOptions.max) {
            questionValidationErrors.options = 'Configuración de número inválida'
          }
        }

        if (Object.keys(questionValidationErrors).length > 0) {
          questionErrors.value[index] = questionValidationErrors
        }
      })

      return Object.keys(errors.value).length === 0 &&
        Object.keys(questionErrors.value).length === 0 &&
        !generalError.value
    }

    /**
     * Maneja el envío del formulario
     */
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      const requestData: CreateSurveyRequest = {
        name: formData.value.name.trim(),
        description: formData.value.description.trim(),
        questions: questions.value,
        template: formData.value.template
      }

      if (formData.value.scheduledOpen) {
        requestData.scheduledOpen = new Date(formData.value.scheduledOpen).toISOString()
      }

      if (formData.value.scheduledClose) {
        requestData.scheduledClose = new Date(formData.value.scheduledClose).toISOString()
      }

      emit('submit', requestData)
    }

    nextTick(() => {
      if (questions.value.length === 0) {
        addQuestion()
      }
    })

    /**
     * Obtiene las opciones numéricas de una pregunta
     * @param question - Pregunta de la cual obtener las opciones
     * @returns Opciones numéricas
     */
    const getNumberOptions = (question: CreateQuestionRequest) => {
      if (question.options && typeof question.options === 'object' && !Array.isArray(question.options) && 'min' in question.options && !('labels' in question.options)) {
        return question.options as NumberOptions
      }
      return { min: 0, max: 100 }
    }

    /**
     * Actualiza las opciones numéricas de una pregunta
     * @param question - Pregunta a actualizar
     * @param index - Índice de la pregunta
     */
    const updateNumberOptions = (question: CreateQuestionRequest, index: number) => {
      console.log('updateNumberOptions', question, index)
    }

    /**
     * Actualiza las opciones de escala de una pregunta
     * @param question - Pregunta a actualizar
     * @param index - Índice de la pregunta
     */
    const updateScaleOptions = (question: CreateQuestionRequest, index: number) => {
      console.log('updateScaleOptions', question, index)
    }

    /**
     * Actualiza una etiqueta específica de la escala
     * @param question - Pregunta a actualizar
     * @param type - Tipo de etiqueta ('min' o 'max')
     * @param event - Evento del input
     */
    const updateScaleLabel = (question: CreateQuestionRequest, type: 'min' | 'max', event: Event) => {
      const target = event.target as HTMLInputElement
      if (!target) return
      
      const value = target.value
      const scaleOptions = getScaleOptions(question)
      
      if (!scaleOptions.labels) {
        scaleOptions.labels = {}
      }
      
      const key = type === 'min' ? scaleOptions.min?.toString() : scaleOptions.max?.toString()
      if (key) {
        scaleOptions.labels[key] = value
        question.options = scaleOptions
      }
    }

    return {
      formData,
      questions,
      errors,
      questionErrors,
      generalError,
      minDate,
      addQuestion,
      removeQuestion,
      onQuestionTypeChange,
      getQuestionOptions,
      updateQuestionOptions,
      addOption,
      removeOption,
      getScaleOptions,
      getNumberOptions,
      updateNumberOptions,
      updateScaleOptions,
      updateScaleLabel, // 👈 Agregar este
      handleSubmit
    }
  }
})
</script>

<style scoped>
.survey-form {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.form-section {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow);
}

.form-section h3 {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--text-primary);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: var(--spacing-sm);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-input.error,
.form-textarea.error {
  border-color: var(--error-color);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.form-checkbox {
  width: auto;
}

.checkbox-text {
  color: var(--text-primary);
  font-weight: 500;
}

.questions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.add-question-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.add-question-btn:hover {
  background: var(--primary-hover);
}

.empty-questions {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}


.form-error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius);
  font-weight: 600;
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
  .survey-form {
    padding: var(--spacing-md);
  }

  .date-row {
    grid-template-columns: 1fr;
  }

  .questions-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>