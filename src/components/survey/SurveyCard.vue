<template>
  <div class="survey-card">
    <div class="survey-header">
      <h3 class="survey-title">{{ survey.title }}</h3>
      <div class="survey-status">
        <span 
          class="status-badge" 
          :class="survey.isActive ? 'status-active' : 'status-inactive'"
        >
          {{ survey.isActive ? 'Activa' : 'Inactiva' }}
        </span>
      </div>
    </div>

    <p class="survey-description">{{ survey.description }}</p>
    
    <div class="survey-stats">
      <div class="stat">
        <span class="stat-icon">📝</span>
        <span class="stat-text">{{ survey.questions.length }} preguntas</span>
      </div>
      <div class="stat">
        <span class="stat-icon">📊</span>
        <span class="stat-text">{{ survey.totalResponses }} respuestas</span>
      </div>
      <div class="stat">
        <span class="stat-icon">🔑</span>
        <span class="stat-text">{{ survey.code }}</span>
      </div>
    </div>

    <div class="survey-dates">
      <p class="date-text">
        Creada: {{ formatDate(survey.createdAt) }}
      </p>
      <p class="date-text">
        Actualizada: {{ formatDate(survey.updatedAt) }}
      </p>
    </div>

    <div class="survey-actions">
      <button 
        @click="$emit('view', survey.id)"
        class="action-btn view-btn"
      >
        Ver Detalles
      </button>
      <button 
        @click="$emit('edit', survey.id)"
        class="action-btn edit-btn"
      >
        Editar
      </button>
      <button 
        @click="$emit('responses', survey.id)"
        class="action-btn responses-btn"
      >
        Respuestas
      </button>
      <button 
        @click="$emit('delete', survey.id)"
        class="action-btn delete-btn"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Survey } from '@/types/survey'

interface Props {
  survey: Survey
}

defineProps<Props>()

defineEmits<{
  view: [id: string]
  edit: [id: string]
  responses: [id: string]
  delete: [id: string]
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.survey-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.survey-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.survey-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.survey-title {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  margin-right: var(--spacing-md);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-inactive {
  background: rgba(107, 114, 128, 0.1);
  color: var(--text-secondary);
}

.survey-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.survey-stats {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.stat-icon {
  font-size: 0.9rem;
}

.stat-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.survey-dates {
  margin-bottom: var(--spacing-lg);
  font-size: 0.8rem;
  color: var(--text-light);
}

.date-text {
  margin: var(--spacing-xs) 0;
}

.survey-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn {
  background: var(--primary-color);
  color: white;
}

.edit-btn {
  background: var(--warning-color);
  color: white;
}

.responses-btn {
  background: #3b82f6;
  color: white;
}

.delete-btn {
  background: var(--error-color);
  color: white;
}

.action-btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}
</style>
