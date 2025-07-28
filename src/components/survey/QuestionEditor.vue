<template>
  <div class="question-editor">
    <div class="question-header">
      <h4>Pregunta {{ question.order }}</h4>
      <button
        class="remove-btn"
        type="button"
        @click="$emit('remove')"
      >
        ❌
      </button>
    </div>

    <!-- Texto de la pregunta -->
    <div class="form-group">
      <label class="form-label">Texto de la pregunta *</label>
      <textarea
        v-model="question.text"
        class="form-textarea"
        placeholder="Escribe aquí el texto de tu pregunta..."
        rows="3"
        required
      />
      <ValidationMessage
        v-if="errors?.text"
        :message="errors.text"
      />
    </div>

    <!-- Tipo de pregunta -->
    <div class="form-group">
      <label class="form-label">Tipo de pregunta *</label>
      <select
        v-model="question.type"
        class="form-select"
        @change="onTypeChange"
      >
        <option value="">
          Selecciona un tipo
        </option>
        <option
          v-for="type in QuestionType"
          :key="type.value"
          :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>
      <ValidationMessage
        v-if="errors?.type"
        :message="errors.type"
      />
    </div>

    <!-- Configuración específica por tipo -->
    <div
      v-if="question.type && needsOptions"
      class="form-group"
    >
      <label class="form-label">Opciones</label>
      
      <!-- Opciones para SINGLE_CHOICE y MULTIPLE_CHOICE -->
      <div v-if="question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE'">
        <div
          v-for="(_ , index) in stringOptions"
          :key="index"
          class="option-row"
        >
          <input
            v-model="stringOptions[index]"
            type="text"
            class="form-input"
            :placeholder="`Opción ${index + 1}`"
          >
          <button
            type="button"
            class="remove-option-btn"
            @click="removeOption(index)"
          >
            ❌
          </button>
        </div>
        <button
          type="button"
          class="add-option-btn"
          @click="addOption"
        >
          + Agregar opción
        </button>
      </div>

      <!-- Configuración para SCALE -->
      <div
        v-if="question.type === 'SCALE'"
        class="scale-config"
      >
        <div class="scale-row">
          <div class="form-group">
            <label class="form-label">Mínimo</label>
            <input
              v-model.number="scaleOptions.min"
              type="number"
              class="form-input"
              min="1"
              max="10"
            >
          </div>
          <div class="form-group">
            <label class="form-label">Máximo</label>
            <input
              v-model.number="scaleOptions.max"
              type="number"
              class="form-input"
              min="2"
              max="10"
            >
          </div>
          <div class="form-group">
            <label class="form-label">Paso</label>
            <input
              v-model.number="scaleOptions.step"
              type="number"
              class="form-input"
              min="1"
              :max="scaleOptions.max - scaleOptions.min"
            >
          </div>
        </div>
        
        <div class="scale-labels">
          <div class="form-group">
            <label class="form-label">Etiqueta mínima</label>
            <input
              v-model="scaleLabels[scaleOptions.min.toString()]"
              type="text"
              class="form-input"
              placeholder="Ej: Muy malo"
            >
          </div>
          <div class="form-group">
            <label class="form-label">Etiqueta máxima</label>
            <input
              v-model="scaleLabels[scaleOptions.max.toString()]"
              type="text"
              class="form-input"
              placeholder="Ej: Excelente"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Pregunta obligatoria -->
    <div class="form-group">
      <label class="checkbox-label">
        <input
          v-model="question.required"
          type="checkbox"
          class="form-checkbox"
        >
        <span class="checkbox-text">Pregunta obligatoria</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CreateQuestionRequest } from '../../types/question'
import type { ScaleOptions } from '../../types/question'
import { QUESTION_TYPES } from '../../utils/constants'
import ValidationMessage from '../../components/forms/ValidationMessage.vue'

// Usar la constante centralizada
const QuestionType = QUESTION_TYPES

interface Props {
  question: CreateQuestionRequest
  errors?: Record<string, string>
}

const props = defineProps<Props>()

defineEmits<{
  remove: []
}>()

// Opciones para preguntas de opción múltiple
const stringOptions = ref<string[]>([])

// Configuración para preguntas de escala
const scaleOptions = ref<ScaleOptions>({
  min: 1,
  max: 5,
  step: 1,
  labels: {}
})

// Reactive labels para evitar problemas con undefined
const scaleLabels = computed({
  get: () => scaleOptions.value.labels || {},
  set: (value) => {
    scaleOptions.value.labels = value
  }
})

// Computadas
const needsOptions = computed(() => {
  return ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SCALE'].includes(props.question.type)
})

// Watchers
watch(() => props.question.type, () => {
  onTypeChange()
}, { immediate: true })

watch(stringOptions, (newOptions) => {
  if (props.question.type === 'SINGLE_CHOICE' || props.question.type === 'MULTIPLE_CHOICE') {
    props.question.options = newOptions.filter(opt => opt.trim() !== '')
  }
}, { deep: true })

watch(scaleOptions, (newOptions) => {
  if (props.question.type === 'SCALE') {
    props.question.options = { ...newOptions }
  }
}, { deep: true })

// Métodos
const onTypeChange = () => {
  const type = props.question.type

  if (type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') {
    stringOptions.value = Array.isArray(props.question.options) 
      ? [...props.question.options] 
      : ['', '']
    props.question.options = stringOptions.value
  } else if (type === 'SCALE') {
    if (props.question.options && typeof props.question.options === 'object' && !Array.isArray(props.question.options)) {
      scaleOptions.value = { 
        ...props.question.options as ScaleOptions,
        labels: (props.question.options as ScaleOptions).labels || {}
      }
    } else {
      scaleOptions.value = {
        min: 1,
        max: 5,
        step: 1,
        labels: { '1': '', '5': '' }
      }
    }
    props.question.options = scaleOptions.value
  } else {
    props.question.options = null
  }
}

const addOption = () => {
  stringOptions.value.push('')
}

const removeOption = (index: number) => {
  if (stringOptions.value.length > 1) {
    stringOptions.value.splice(index, 1)
  }
}

// Inicializar si ya hay datos
if (props.question.options) {
  if (Array.isArray(props.question.options)) {
    stringOptions.value = [...props.question.options]
  } else if (typeof props.question.options === 'object') {
    const options = props.question.options as ScaleOptions
    scaleOptions.value = { 
      ...options,
      labels: options.labels || {}
    }
  }
}
</script>

<style scoped>
.question-editor {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
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
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  color: var(--text-primary);
}

.form-textarea,
.form-input,
.form-select {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
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
  border-radius: var(--border-radius);
  transition: background 0.2s ease;
}

.remove-option-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.add-option-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.add-option-btn:hover {
  background: var(--primary-hover);
}

.scale-config {
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

.scale-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.scale-labels {
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

@media (max-width: 768px) {
  .scale-row {
    grid-template-columns: 1fr;
  }
  
  .scale-labels {
    grid-template-columns: 1fr;
  }
  
  .option-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
