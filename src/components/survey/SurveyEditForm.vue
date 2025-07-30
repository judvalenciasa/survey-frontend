<!--
/**
 * Formulario de edición de encuestas
 * @description Formulario especializado para editar encuestas existentes basado en SurveyForm
 * @component SurveyEditForm
 */
-->
<template>
  <form class="survey-edit-form" @submit.prevent="handleSubmit">
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
          <label class="form-label required-field">
            📅 Fecha de apertura
            <span class="required-badge">*Obligatorio</span>
          </label>
          <input v-model="formData.scheduledOpen" type="datetime-local" class="form-input"
            :class="{ error: errors.scheduledOpen }" :min="minDate" required>
          <small class="field-help">Selecciona cuándo se abrirá la encuesta para respuestas</small>
          <ValidationMessage v-if="errors.scheduledOpen" :message="errors.scheduledOpen" />
        </div>
        <div class="form-group">
          <label class="form-label required-field">
            🔒 Fecha de cierre
            <span class="required-badge">*Obligatorio</span>
          </label>
          <input v-model="formData.scheduledClose" type="datetime-local" class="form-input"
            :class="{ error: errors.scheduledClose }" :min="formData.scheduledOpen || minDate" required>
          <small class="field-help">Selecciona cuándo se cerrará la encuesta automáticamente</small>
          <ValidationMessage v-if="errors.scheduledClose" :message="errors.scheduledClose" />
        </div>
      </div>

      <!-- Estado de la encuesta -->
      <div class="form-group">
        <label class="form-label">Estado de la encuesta</label>
        <select v-model="formData.status" class="form-input">
          <option value="CREADA">
            Creada
          </option>
          <option value="PUBLICADA">
            Publicada
          </option>
          <option value="FINALIZADA">
            Finalizada
          </option>
        </select>
      </div>
    </div>

    <!-- Sección de preguntas -->
    <div class="form-section">
      <div v-if="questions.length === 0" class="empty-questions">
        <div class="empty-icon">
          ❓
        </div>
        <p>No hay preguntas aún. Agrega la primera pregunta para comenzar.</p>
        <button type="button" class="add-question-btn" @click="addQuestion">
          Agregar Primera Pregunta
        </button>
      </div>



      <div v-if="questions.length > 0" class="questions-list">
        <div v-for="(question, index) in questions" :key="question.id || `question-${index}`"
          class="question-edit-card">
          <div class="question-header">
            <h4>Pregunta {{ index + 1 }}</h4>
            <button type="button" class="remove-btn" @click="removeQuestion(index)">
              🗑️ Eliminar
            </button>
          </div>

          <div class="form-group">
            <label class="form-label">Texto de la pregunta *</label>
            <textarea v-model="question.text" class="form-textarea"
              placeholder="Escribe aquí el texto de tu pregunta..." rows="2" required />
          </div>

          <div class="form-group">
            <label class="form-label">Tipo de pregunta *</label>
            <select v-model="question.type" class="form-input" @change="onQuestionTypeChange(question, index)">
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
                🔢 Número
              </option>
            </select>
          </div>

          <!-- Opciones para SINGLE_CHOICE y MULTIPLE_CHOICE -->
          <div v-if="question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE'" class="form-group">
            <label class="form-label">Opciones de respuesta</label>
            <div v-for="(_option, optIndex) in getQuestionOptions(question)" :key="optIndex" class="option-row">
              <input v-model="getQuestionOptions(question)[optIndex]" type="text"
                :placeholder="`Opción ${optIndex + 1}`" class="form-input">
              <button v-if="getQuestionOptions(question).length > 1" type="button" class="remove-option-btn"
                @click="removeOption(question, optIndex)">
                ❌
              </button>
            </div>
            <button type="button" class="add-option-btn" @click="addOption(question)">
              + Agregar opción
            </button>
          </div>

          <!-- Configuración para SCALE -->
          <div v-if="question.type === 'SCALE'" class="form-group">
            <label class="form-label">Configuración de escala</label>

            <div class="scale-config">
              <div class="scale-row">
                <div class="scale-field">
                  <label class="form-label-small">Mínimo:</label>
                  <input :value="getScaleOptions(question)?.min || 1" type="number" class="form-input" min="1"
                    @input="updateScaleConfig(question, 'min', $event)">
                </div>
                <div class="scale-field">
                  <label class="form-label-small">Máximo:</label>
                  <input :value="getScaleOptions(question)?.max || 5" type="number" class="form-input" min="2"
                    @input="updateScaleConfig(question, 'max', $event)">
                </div>
                <div class="scale-field">
                  <label class="form-label-small">Paso:</label>
                  <input :value="getScaleOptions(question)?.step || 1" type="number" class="form-input" min="1"
                    @input="updateScaleConfig(question, 'step', $event)">
                </div>
              </div>

              <div class="scale-labels">
                <div class="scale-field">
                  <label class="form-label-small">Etiqueta mínima:</label>
                  <input :value="getScaleOptions(question)?.labels?.[getScaleOptions(question)?.min || 1] || ''"
                    type="text" class="form-input" placeholder="Ej: Muy malo"
                    @input="updateScaleLabel(question, 'min', $event)">
                </div>
                <div class="scale-field">
                  <label class="form-label-small">Etiqueta máxima:</label>
                  <input :value="getScaleOptions(question)?.labels?.[getScaleOptions(question)?.max || 5] || ''"
                    type="text" class="form-input" placeholder="Ej: Excelente"
                    @input="updateScaleLabel(question, 'max', $event)">
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración para NUMBER -->
          <div v-if="question.type === 'NUMBER'" class="form-group">
            <label class="form-label">Configuración numérica</label>
            <div class="number-config">
              <div class="scale-field">
                <label class="form-label-small">Valor mínimo:</label>
                <input :value="getNumberOptions(question)?.min || 0" type="number" class="form-input"
                  @input="updateNumberConfig(question, 'min', $event)">
              </div>
              <div class="scale-field">
                <label class="form-label-small">Valor máximo:</label>
                <input :value="getNumberOptions(question)?.max || 100" type="number" class="form-input"
                  @input="updateNumberConfig(question, 'max', $event)">
              </div>
            </div>
          </div>

          <!-- Pregunta obligatoria -->
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="question.required" type="checkbox" class="form-checkbox">
              <span class="checkbox-text">Pregunta obligatoria</span>
            </label>
          </div>
        </div>
      </div>

      <div class="questions-header">
        <h3>Preguntas ({{ questions.length }})</h3>
        <button type="button" class="add-question-btn" @click="addQuestion">
          + Agregar Pregunta
        </button>
      </div>
    </div>

    <!-- Error general -->
    <div v-if="generalError" class="form-error">
      {{ generalError }}
    </div>

    <!-- Botones de acción -->
    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="emit('cancel')">
        Cancelar
      </button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <span v-if="loading">Actualizando...</span>
        <span v-else">Actualizar Encuesta</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Survey, UpdateSurveyRequest } from '../../types/survey'
import type { Question } from '../../types/question'
import ValidationMessage from '../forms/ValidationMessage.vue'

interface Props {
  survey: Survey
  loading?: boolean
}

const props = defineProps<Props>()

/**
 * Eventos que emite el componente
 */
const emit = defineEmits<{
  submit: [data: UpdateSurveyRequest]
  cancel: []
}>()

/**
 * Obtiene la fecha actual en formato datetime-local
 */
const getCurrentDateTime = (): string => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

/**
 * Datos del formulario inicializados con los valores de la encuesta
 */
const formData = reactive({
  name: props.survey.name,
  description: props.survey.description,
  status: props.survey.status,
  scheduledOpen: props.survey.scheduledOpen ?
    new Date(props.survey.scheduledOpen).toISOString().slice(0, 16) : getCurrentDateTime(),
  scheduledClose: props.survey.scheduledClose ?
    new Date(props.survey.scheduledClose).toISOString().slice(0, 16) : ''
})

/**
 * Preguntas de la encuesta (copia para editar)
 */
const questions = ref<Question[]>([...props.survey.questions])

const errors = ref<Record<string, string>>({})
const generalError = ref<string | null>(null)

/**
 * Fecha mínima para los campos de fecha
 */
const minDate = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

/**
 * Agrega una nueva pregunta
 */
const addQuestion = () => {
  const newQuestion: Question = {
    id: `temp-${Date.now()}`, // ID temporal
    text: '',
    type: 'TEXT',
    required: true,
    options: null,
    order: questions.value.length + 1
  }
  questions.value.push(newQuestion)
}

/**
 * Elimina una pregunta
 * @param index - Índice de la pregunta a eliminar
 */
const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
  // Reordenar
  questions.value.forEach((question, idx) => {
    question.order = idx + 1
  })
}

/**
 * Maneja el cambio de tipo de pregunta
 */
const onQuestionTypeChange = (question: Question, _index: number) => {
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
    if (typeof question.options !== 'object' || Array.isArray(question.options)) {
      question.options = { min: 0, max: 100 }
    }
  } else {
    question.options = null
  }
}

/**
 * Obtiene las opciones de una pregunta como array
 */
const getQuestionOptions = (question: Question): string[] => {
  if (Array.isArray(question.options)) {
    return question.options
  }
  return ['', '']
}

/**
 * Obtiene la configuración de opciones para preguntas tipo escala
 */
const getScaleOptions = (question: Question) => {
  if (question.type === 'SCALE' && question.options && typeof question.options === 'object' && !Array.isArray(question.options)) {
    return question.options
  }
  return { min: 1, max: 5, step: 1, labels: {} }
}

/**
 * Obtiene la configuración de opciones para preguntas tipo número
 */
const getNumberOptions = (question: Question) => {
  if (question.type === 'NUMBER' && question.options && typeof question.options === 'object' && !Array.isArray(question.options)) {
    return question.options
  }
  return { min: 0, max: 100 }
}

/**
 * Actualiza la configuración de escala
 */
const updateScaleConfig = (question: Question, field: 'min' | 'max' | 'step', event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return

  const value = target.value
  if (question.type === 'SCALE') {
    if (!question.options || typeof question.options !== 'object' || Array.isArray(question.options)) {
      question.options = { min: 1, max: 5, step: 1, labels: {} }
    }
    const numValue = parseInt(value)
    if (!isNaN(numValue) && question.options) {
      (question.options as any)[field] = numValue
    }
  }
}

/**
 * Actualiza las etiquetas de escala
 */
const updateScaleLabel = (question: Question, type: 'min' | 'max', event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return

  const value = target.value
  if (question.type === 'SCALE') {
    if (!question.options || typeof question.options !== 'object' || Array.isArray(question.options)) {
      question.options = { min: 1, max: 5, step: 1, labels: {} }
    }
    if (question.options && !question.options.labels) {
      question.options.labels = {}
    }
    if (question.options && question.options.labels) {
      const key = type === 'min' ? question.options.min : question.options.max
      question.options.labels[key] = value
    }
  }
}

/**
 * Actualiza la configuración de números
 */
const updateNumberConfig = (question: Question, field: 'min' | 'max', event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return

  const value = target.value
  if (question.type === 'NUMBER') {
    if (!question.options || typeof question.options !== 'object' || Array.isArray(question.options)) {
      question.options = { min: 0, max: 100 }
    }
    const numValue = parseInt(value)
    if (!isNaN(numValue) && question.options) {
      (question.options as any)[field] = numValue
    }
  }
}

/**
 * Agrega una opción a una pregunta
 */
const addOption = (question: Question) => {
  if (Array.isArray(question.options)) {
    question.options.push('')
  }
}

/**
 * Elimina una opción de una pregunta
 */
const removeOption = (question: Question, optionIndex: number) => {
  if (Array.isArray(question.options) && question.options.length > 1) {
    question.options.splice(optionIndex, 1)
  }
}

/**
 * Valida el formulario
 */
const validateForm = (): boolean => {
  errors.value = {}
  generalError.value = null

  if (!formData.name.trim()) {
    errors.value.name = 'El nombre de la encuesta es obligatorio'
  }

  if (!formData.description.trim()) {
    errors.value.description = 'La descripción es obligatoria'
  }

  // Validar fechas obligatorias
  if (!formData.scheduledOpen || formData.scheduledOpen.trim() === '') {
    errors.value.scheduledOpen = 'La fecha de apertura es obligatoria'
  }

  if (!formData.scheduledClose || formData.scheduledClose.trim() === '') {
    errors.value.scheduledClose = 'La fecha de cierre es obligatoria'
  }

  // Validar orden de fechas (solo si ambas están presentes)
  if (formData.scheduledOpen && formData.scheduledOpen.trim() !== '' &&
    formData.scheduledClose && formData.scheduledClose.trim() !== '') {
    const openDate = new Date(formData.scheduledOpen)
    const closeDate = new Date(formData.scheduledClose)

    if (closeDate <= openDate) {
      errors.value.scheduledClose = 'La fecha de cierre debe ser posterior a la de apertura'
    }
  }

  if (questions.value.length === 0) {
    generalError.value = 'Debe tener al menos una pregunta'
    return false
  }

  // Validar preguntas
  const invalidQuestions = questions.value.some(question => {
    if (!question.text.trim()) return true
    if (!question.type) return true
    if ((question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') &&
      (!Array.isArray(question.options) || question.options.length < 2 ||
        question.options.some(opt => !opt.trim()))) {
      return true
    }
    return false
  })

  if (invalidQuestions) {
    generalError.value = 'Todas las preguntas deben tener texto y opciones válidas'
    return false
  }

  return Object.keys(errors.value).length === 0 && !generalError.value
}

/**
 * Maneja el envío del formulario
 */
const handleSubmit = () => {
  console.log('🔍 Validando formulario...', {
    scheduledOpen: formData.scheduledOpen,
    scheduledClose: formData.scheduledClose
  })

  if (!validateForm()) {
    console.log('❌ Validación falló:', errors.value)
    return
  }

  console.log('✅ Validación exitosa, enviando datos...')

  const updateData: UpdateSurveyRequest = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    status: formData.status,
    questions: questions.value.map(q => ({
      ...q,
      options: q.options && Array.isArray(q.options) ?
        q.options.filter(opt => opt.trim() !== '') : q.options
    }))
  }

  // Solo agregar fechas si están presentes y válidas
  if (formData.scheduledOpen && formData.scheduledOpen.trim() !== '') {
    updateData.scheduledOpen = new Date(formData.scheduledOpen).toISOString()
  }

  if (formData.scheduledClose && formData.scheduledClose.trim() !== '') {
    updateData.scheduledClose = new Date(formData.scheduledClose).toISOString()
  }

  emit('submit', updateData)
}

// Watch para actualizar formData si cambia la prop survey
watch(() => props.survey, (newSurvey) => {
  formData.name = newSurvey.name
  formData.description = newSurvey.description
  formData.status = newSurvey.status
  formData.scheduledOpen = newSurvey.scheduledOpen ?
    new Date(newSurvey.scheduledOpen).toISOString().slice(0, 16) : getCurrentDateTime()
  formData.scheduledClose = newSurvey.scheduledClose ?
    new Date(newSurvey.scheduledClose).toISOString().slice(0, 16) : ''
  questions.value = [...newSurvey.questions]
}, { immediate: true })
</script>

<script lang="ts">
export default {
  name: 'SurveyEditForm'
}
</script>

<style scoped>
.survey-edit-form {
  max-width: 800px;
  margin: 0 auto;
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

.form-label-small {
  font-size: 0.9rem;
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

/* Estilos para campos obligatorios */
.required-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.required-badge {
  background: linear-gradient(135deg, var(--error-color), #dc2626);
  color: white;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  white-space: nowrap;
  animation: pulse-required 2s infinite;
}

@keyframes pulse-required {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.field-help {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
  font-style: italic;
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

.questions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.question-edit-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.question-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.remove-btn {
  background: var(--error-color);
  color: white;
  border: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.8rem;
}

.option-row {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  align-items: center;
}

.option-row .form-input {
  flex: 1;
}

.remove-option-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  padding: var(--spacing-xs);
}

.add-option-btn {
  background: var(--success-color);
  color: white;
  border: none;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
}

.scale-config,
.number-config {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  background: var(--bg-tertiary);
}

.scale-row,
.scale-labels,
.number-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.scale-labels {
  margin-bottom: 0;
}

.scale-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
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

/* Mejorar el responsive para fechas obligatorias */
@media (max-width: 768px) {
  .date-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .required-field {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .required-badge {
    align-self: flex-end;
    font-size: 0.65rem;
    padding: 3px 6px;
  }

  .field-help {
    font-size: 0.8rem;
    margin-top: var(--spacing-sm);
  }

  .questions-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .form-actions {
    flex-direction: column;
  }

  .option-row {
    flex-direction: column;
    align-items: stretch;
  }

  .scale-row,
  .scale-labels,
  .number-config {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .required-field {
    gap: var(--spacing-sm);
  }

  .field-help {
    margin-top: var(--spacing-md);
    line-height: 1.4;
  }
}
</style>
