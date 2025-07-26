<template>
  <div class="question-render">
    <div class="question-header">
      <h3 class="question-title">
        {{ question.text }}
        <span v-if="question.required" class="required">*</span>
      </h3>
    </div>

    <div class="question-content">
      <!-- Texto libre -->
      <div v-if="question.type === 'TEXT'" class="text-input">
        <textarea
          v-model="answer"
          @input="updateAnswer"
          class="form-textarea"
          :placeholder="'Escribe tu respuesta aquí...'"
          rows="4"
        />
      </div>

      <!-- Sí/No -->
      <div v-else-if="question.type === 'YES_NO'" class="yes-no-options">
        <label class="radio-option">
          <input
            v-model="answer"
            @change="updateAnswer"
            type="radio"
            value="true"
            name="`question-${question.id}`"
          />
          <span class="radio-text">Sí</span>
        </label>
        <label class="radio-option">
          <input
            v-model="answer"
            @change="updateAnswer"
            type="radio"
            value="false"
            name="`question-${question.id}`"
          />
          <span class="radio-text">No</span>
        </label>
      </div>

      <!-- Opción única -->
      <div v-else-if="question.type === 'SINGLE_CHOICE'" class="single-choice-options">
        <label
          v-for="(option, index) in stringOptions"
          :key="index"
          class="radio-option"
        >
          <input
            v-model="answer"
            @change="updateAnswer"
            type="radio"
            :value="option"
            :name="`question-${question.id}`"
          />
          <span class="radio-text">{{ option }}</span>
        </label>
      </div>

      <!-- Múltiple selección -->
      <div v-else-if="question.type === 'MULTIPLE_CHOICE'" class="multiple-choice-options">
        <label
          v-for="(option, index) in stringOptions"
          :key="index"
          class="checkbox-option"
        >
          <input
            v-model="multipleAnswer"
            @change="updateMultipleAnswer"
            type="checkbox"
            :value="option"
          />
          <span class="checkbox-text">{{ option }}</span>
        </label>
      </div>

      <!-- Escala -->
      <div v-else-if="question.type === 'SCALE'" class="scale-options">
        <div class="scale-container">
          <div class="scale-labels">
            <span class="scale-label-min">
              {{ scaleOptions.labels?.[scaleOptions.min?.toString()] || scaleOptions.min }}
            </span>
            <span class="scale-label-max">
              {{ scaleOptions.labels?.[scaleOptions.max?.toString()] || scaleOptions.max }}
            </span>
          </div>
          
          <div class="scale-values">
            <label
              v-for="value in scaleRange"
              :key="value"
              class="scale-value"
            >
              <input
                v-model.number="answer"
                @change="updateAnswer"
                type="radio"
                :value="value"
                :name="`question-${question.id}`"
              />
              <span class="scale-number">{{ value }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Question, ScaleOptions } from '@/types/survey'

interface Props {
  question: Question
  modelValue?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

// Estado local de la respuesta
const answer = ref<any>(props.modelValue || '')
const multipleAnswer = ref<string[]>(Array.isArray(props.modelValue) ? props.modelValue : [])

// Computadas
const stringOptions = computed(() => {
  if (Array.isArray(props.question.options)) {
    return props.question.options
  }
  return []
})

const scaleOptions = computed(() => {
  if (props.question.options && typeof props.question.options === 'object' && !Array.isArray(props.question.options)) {
    return props.question.options as ScaleOptions
  }
  return { min: 1, max: 5, step: 1, labels: {} }
})

const scaleRange = computed(() => {
  const range = []
  const min = scaleOptions.value.min || 1
  const max = scaleOptions.value.max || 5
  const step = scaleOptions.value.step || 1
  
  for (let i = min; i <= max; i += step) {
    range.push(i)
  }
  return range
})

// Métodos
const updateAnswer = () => {
  emit('update:modelValue', answer.value)
}

const updateMultipleAnswer = () => {
  emit('update:modelValue', multipleAnswer.value)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (props.question.type === 'MULTIPLE_CHOICE') {
    multipleAnswer.value = Array.isArray(newValue) ? newValue : []
  } else {
    answer.value = newValue
  }
})

// Inicialización
onMounted(() => {
  if (props.question.type === 'MULTIPLE_CHOICE') {
    multipleAnswer.value = Array.isArray(props.modelValue) ? props.modelValue : []
  } else {
    answer.value = props.modelValue || ''
  }
})
</script>

<style scoped>
.question-render {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow);
}

.question-header {
  margin-bottom: var(--spacing-lg);
}

.question-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.5;
}

.required {
  color: var(--error-color);
  margin-left: var(--spacing-xs);
}

.question-content {
  width: 100%;
}

.form-textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.yes-no-options,
.single-choice-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option:hover {
  border-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.05);
}

.radio-option input[type="radio"] {
  margin: 0;
}

.radio-text {
  color: var(--text-primary);
  font-weight: 500;
}

.multiple-choice-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-option:hover {
  border-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.05);
}

.checkbox-option input[type="checkbox"] {
  margin: 0;
}

.checkbox-text {
  color: var(--text-primary);
  font-weight: 500;
}

.scale-container {
  width: 100%;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.scale-values {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.scale-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  flex: 1;
  max-width: 60px;
}

.scale-value:hover {
  border-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.05);
}

.scale-value input[type="radio"] {
  margin: 0 0 var(--spacing-xs) 0;
}

.scale-number {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .question-render {
    padding: var(--spacing-lg);
  }
  
  .scale-values {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .scale-value {
    min-width: 50px;
  }
}
</style>
