<template>
    <form @submit.prevent="handleSubmit" class="survey-form">
      <div class="form-section">
        <h3>Información General</h3>
        
        <!-- Nombre de la encuesta -->
        <div class="form-group">
          <label class="form-label">Nombre de la encuesta *</label>
          <input
            v-model="formData.name"
            type="text"
            class="form-input"
            :class="{ error: errors.name }"
            placeholder="Ej: Encuesta de Satisfacción Laboral 2025"
            required
          />
          <ValidationMessage v-if="errors.name" :message="errors.name" />
        </div>
  
        <!-- Descripción -->
        <div class="form-group">
          <label class="form-label">Descripción *</label>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            :class="{ error: errors.description }"
            placeholder="Describe el propósito y objetivos de esta encuesta..."
            rows="4"
            required
          />
          <ValidationMessage v-if="errors.description" :message="errors.description" />
        </div>
  
        <!-- Fechas de programación -->
        <div class="date-row">
          <div class="form-group">
            <label class="form-label">Fecha de apertura</label>
            <input
              v-model="formData.scheduledOpen"
              type="datetime-local"
              class="form-input"
              :min="minDate"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de cierre</label>
            <input
              v-model="formData.scheduledClose"
              type="datetime-local"
              class="form-input"
              :min="formData.scheduledOpen || minDate"
            />
          </div>
        </div>
  
        <!-- Opciones adicionales -->
        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="formData.template" type="checkbox" class="form-checkbox" />
            <span class="checkbox-text">Guardar como plantilla</span>
          </label>
        </div>
      </div>
  
      <div class="form-section">
        <div class="questions-header">
          <h3>Preguntas ({{ questions.length }})</h3>
          <button @click="addQuestion" type="button" class="add-question-btn">
            + Agregar Pregunta
          </button>
        </div>
  
        <div v-if="questions.length === 0" class="empty-questions">
          <div class="empty-icon">❓</div>
          <p>No hay preguntas aún. Agrega la primera pregunta para comenzar.</p>
          <button @click="addQuestion" type="button" class="add-question-btn">
            Agregar Primera Pregunta
          </button>
        </div>
  
        <div v-else class="questions-list">
          <!-- DEBUGGING MEJORADO -->
          <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px; border: 2px solid #333;">
            <h4>🐛 DEBUG INFO</h4>
            <p><strong>Cantidad de preguntas:</strong> {{ questions.length }}</p>
            <p><strong>Estado del array:</strong></p>
            <div v-for="(question, index) in questions" :key="index" style="background: white; padding: 10px; margin: 5px 0; border-radius: 4px;">
              <p><strong>Pregunta {{ index + 1 }}:</strong></p>
              <p>📝 Texto: "{{ question.text || '[VACÍO]' }}"</p>
              <p>🏷️ Tipo: {{ question.type }}</p>
              <p>⚡ Orden: {{ question.order }}</p>
              <p>❗ Obligatoria: {{ question.required ? 'Sí' : 'No' }}</p>
            </div>
          </div>
          
          <!-- Reemplaza la sección "COMPONENTE SIMPLE DE PREGUNTA" con esto: -->
          <div 
            v-for="(question, index) in questions" 
            :key="`simple-question-${index}`"
            style="border: 2px solid #007bff; padding: 20px; margin: 15px 0; border-radius: 8px; background: white;"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h4 style="margin: 0; color: #007bff;">🔹 Pregunta {{ question.order }}</h4>
              <button 
                @click="removeQuestion(index)" 
                style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;"
              >
                🗑️ Eliminar
              </button>
            </div>
            
            <!-- Campo de texto -->
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: bold; margin-bottom: 5px;">Texto de la pregunta:</label>
              <input 
                v-model="question.text"
                type="text" 
                placeholder="Escribe el texto de tu pregunta..." 
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"
              />
            </div>
            
            <!-- Selector de tipo -->
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: bold; margin-bottom: 5px;">Tipo de pregunta:</label>
              <select 
                v-model="question.type" 
                @change="onQuestionTypeChange(question, index)"
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"
              >
                <option value="TEXT">📝 Texto libre</option>
                <option value="SINGLE_CHOICE">🔘 Opción única</option>
                <option value="MULTIPLE_CHOICE">☑️ Múltiple selección</option>
                <option value="YES_NO">✅ Sí/No</option>
                <option value="SCALE">📊 Escala</option>
              </select>
            </div>

            <!-- ✨ OPCIONES PARA SINGLE_CHOICE Y MULTIPLE_CHOICE -->
            <div v-if="question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE'" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: bold; margin-bottom: 10px;">Opciones de respuesta:</label>
              
              <div v-for="(option, optIndex) in getQuestionOptions(question)" :key="optIndex" 
                   style="display: flex; gap: 10px; margin-bottom: 8px; align-items: center;">
                <input 
                  v-model="getQuestionOptions(question)[optIndex]"
                  @input="updateQuestionOptions(question, index)"
                  type="text" 
                  :placeholder="`Opción ${optIndex + 1}`"
                  style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                />
                <button 
                  @click="removeOption(question, index, optIndex)"
                  style="background: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;"
                  v-if="getQuestionOptions(question).length > 1"
                >
                  ❌
                </button>
              </div>
              
              <button 
                @click="addOption(question, index)"
                style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 5px;"
              >
                + Agregar opción
              </button>
            </div>

            <!-- ✨ CONFIGURACIÓN PARA ESCALA -->
            <div v-if="question.type === 'SCALE'" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: bold; margin-bottom: 10px;">Configuración de escala:</label>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                  <label style="display: block; font-weight: bold; margin-bottom: 5px;">Mínimo:</label>
                  <input 
                    v-model.number="getScaleOptions(question).min"
                    @input="updateScaleOptions(question, index)"
                    type="number" 
                    min="1" max="10"
                    style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  />
                </div>
                <div>
                  <label style="display: block; font-weight: bold; margin-bottom: 5px;">Máximo:</label>
                  <input 
                    v-model.number="getScaleOptions(question).max"
                    @input="updateScaleOptions(question, index)"
                    type="number" 
                    min="2" max="10"
                    style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  />
                </div>
                <div>
                  <label style="display: block; font-weight: bold; margin-bottom: 5px;">Paso:</label>
                  <input 
                    v-model.number="getScaleOptions(question).step"
                    @input="updateScaleOptions(question, index)"
                    type="number" 
                    min="1"
                    style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  />
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <label style="display: block; font-weight: bold; margin-bottom: 5px;">Etiqueta mínima:</label>
                  <input 
                    v-model="getScaleOptions(question).labels[getScaleOptions(question).min.toString()]"
                    @input="updateScaleOptions(question, index)"
                    type="text" 
                    placeholder="Ej: Muy malo"
                    style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  />
                </div>
                <div>
                  <label style="display: block; font-weight: bold; margin-bottom: 5px;">Etiqueta máxima:</label>
                  <input 
                    v-model="getScaleOptions(question).labels[getScaleOptions(question).max.toString()]"
                    @input="updateScaleOptions(question, index)"
                    type="text" 
                    placeholder="Ej: Excelente"
                    style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                  />
                </div>
              </div>
            </div>
            
            <!-- Checkbox obligatoria -->
            <div>
              <label style="display: flex; align-items: center; gap: 8px;">
                <input v-model="question.required" type="checkbox" />
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
        <button type="button" @click="$emit('cancel')" class="btn-secondary">
          Cancelar
        </button>
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading">Creando...</span>
          <span v-else>Crear Encuesta</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import type { CreateSurveyRequest, CreateQuestionRequest } from '@/types/survey'
  import QuestionEditor from './QuestionEditor.vue'
  import ValidationMessage from '@/components/forms/ValidationMessage.vue'
  
  interface Props {
    loading?: boolean
  }
  
  defineProps<Props>()
  
  const emit = defineEmits<{
    submit: [data: CreateSurveyRequest]
    cancel: []
  }>()
  
  // Estado del formulario
  const formData = ref({
    name: '',
    description: '',
    scheduledOpen: '',
    scheduledClose: '',
    template: false
  })
  
  const questions = ref<CreateQuestionRequest[]>([])
  
  // Estado de errores
  const errors = ref<Record<string, string>>({})
  const questionErrors = ref<Record<number, Record<string, string>>>({})
  const generalError = ref<string | null>(null)
  
  // Computadas
  const minDate = computed(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  
  // Métodos para manejar preguntas
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
  
  const removeQuestion = (index: number) => {
    questions.value.splice(index, 1)
    // Reordenar las preguntas restantes
    questions.value.forEach((question, idx) => {
      question.order = idx + 1
    })
    // Limpiar errores de la pregunta eliminada
    delete questionErrors.value[index]
  }

  // Métodos para manejar opciones de preguntas
  const onQuestionTypeChange = (question: CreateQuestionRequest, index: number) => {
    const type = question.type
    
    if (type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') {
      question.options = ['', '']
    } else if (type === 'SCALE') {
      question.options = {
        min: 1,
        max: 5,
        step: 1,
        labels: { '1': '', '5': '' }
      }
    } else {
      question.options = null
    }
  }

  const getQuestionOptions = (question: CreateQuestionRequest): string[] => {
    if (Array.isArray(question.options)) {
      return question.options
    }
    return ['', '']
  }

  const updateQuestionOptions = (question: CreateQuestionRequest, index: number) => {
    // La actualización es automática por v-model
  }

  const addOption = (question: CreateQuestionRequest, index: number) => {
    if (Array.isArray(question.options)) {
      question.options.push('')
    }
  }

  const removeOption = (question: CreateQuestionRequest, questionIndex: number, optionIndex: number) => {
    if (Array.isArray(question.options) && question.options.length > 1) {
      question.options.splice(optionIndex, 1)
    }
  }

  // Métodos para manejar opciones de escala
  const getScaleOptions = (question: CreateQuestionRequest) => {
    if (question.options && typeof question.options === 'object' && !Array.isArray(question.options)) {
      return question.options as any
    }
    return { min: 1, max: 5, step: 1, labels: {} }
  }

  const updateScaleOptions = (question: CreateQuestionRequest, index: number) => {
    // La actualización es automática por v-model
  }
  
  // Validación
  const validateForm = (): boolean => {
    errors.value = {}
    questionErrors.value = {}
    generalError.value = null
  
    // Validar información general
    if (!formData.value.name.trim()) {
      errors.value.name = 'El nombre es obligatorio'
    } else if (formData.value.name.trim().length < 3) {
      errors.value.name = 'El nombre debe tener al menos 3 caracteres'
    }
  
    if (!formData.value.description.trim()) {
      errors.value.description = 'La descripción es obligatoria'
    } else if (formData.value.description.trim().length < 10) {
      errors.value.description = 'La descripción debe tener al menos 10 caracteres'
    }
  
    // Validar fechas
    if (formData.value.scheduledOpen && formData.value.scheduledClose) {
      const openDate = new Date(formData.value.scheduledOpen)
      const closeDate = new Date(formData.value.scheduledClose)
      
      if (closeDate <= openDate) {
        errors.value.scheduledClose = 'La fecha de cierre debe ser posterior a la de apertura'
      }
    }
  
    // Validar que hay al menos una pregunta
    if (questions.value.length === 0) {
      generalError.value = 'Debe agregar al menos una pregunta'
      return false
    }
  
    // Validar cada pregunta
    questions.value.forEach((question, index) => {
      const questionValidationErrors: Record<string, string> = {}
  
      if (!question.text.trim()) {
        questionValidationErrors.text = 'El texto de la pregunta es obligatorio'
      }
  
      if (!question.type) {
        questionValidationErrors.type = 'Debe seleccionar un tipo de pregunta'
      }
  
      // Validar opciones según el tipo
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
  
      if (Object.keys(questionValidationErrors).length > 0) {
        questionErrors.value[index] = questionValidationErrors
      }
    })
  
    return Object.keys(errors.value).length === 0 && 
           Object.keys(questionErrors.value).length === 0 && 
           !generalError.value
  }
  
  // Envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }
  
    // Preparar datos para envío
    const requestData: CreateSurveyRequest = {
      name: formData.value.name.trim(),
      description: formData.value.description.trim(),
      questions: questions.value,
      template: formData.value.template
    }
  
    // Agregar fechas si están definidas
    if (formData.value.scheduledOpen) {
      requestData.scheduledOpen = new Date(formData.value.scheduledOpen).toISOString()
    }
  
    if (formData.value.scheduledClose) {
      requestData.scheduledClose = new Date(formData.value.scheduledClose).toISOString()
    }
  
    emit('submit', requestData)
  }
  
  // Inicializar con una pregunta por defecto
  nextTick(() => {
    if (questions.value.length === 0) {
      addQuestion()
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
  
  .questions-list {
    /* Las preguntas individuales tienen su propio margen */
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