<!--
/**
 * Tarjeta de encuesta para listados y dashboard
 * @description Muestra información resumida de una encuesta con acciones disponibles
 * @component SurveyCard
 */
-->
<template>
  <div class="survey-card">
    <div class="survey-header">
      <h3 class="survey-title">
        {{ survey.name }}
      </h3>
      <div class="survey-status">
        <span class="status-badge" :class="getStatusClass(survey.status)">
          {{ getStatusLabel(survey.status) }}
        </span>
      </div>
    </div>

    <p class="survey-description">
      {{ survey.description }}
    </p>

    <div class="survey-stats">
      <!-- ✨ NUEVO: Mostrar ID de la encuesta -->
      <div class="stat stat-id">
        <span class="stat-icon">🔢</span>
        <span class="stat-text">ID: {{ survey.id }}</span>
        <button class="copy-btn" title="Copiar ID" @click="copyToClipboard(survey.id)">
          📋
        </button>
      </div>

      <div class="stat">
        <span class="stat-icon">📝</span>
        <span class="stat-text">{{ survey.questions.length }} preguntas</span>
      </div>
      <div class="stat">
        <span class="stat-icon">📊</span>
        <span class="stat-text">{{ survey.totalResponses || 0 }} respuestas</span>
      </div>
      <div v-if="survey.code" class="stat">
        <span class="stat-icon">🔑</span>
        <span class="stat-text">{{ survey.code }}</span>
      </div>
    </div>

    <div class="survey-dates">
      <p class="date-text">
        Creada: {{ formatDate(survey.createdAt) }}
      </p>
      <p class="date-text">
        Actualizada: {{ formatDate(survey.modifiedAt) }}
      </p>
    </div>

    <div class="survey-actions">
      <!-- Botones de estado según corresponda -->
      <button v-if="survey.status === 'CREADA'" class="action-btn publish-btn"
        title="Publicar encuesta para que sea visible al público" @click="$emit('publish', survey.id)">
        📢 Publicar
      </button>

      <button v-if="survey.status === 'PUBLICADA'" class="action-btn close-btn"
        title="Cerrar encuesta - ya no se podrán enviar más respuestas" @click="$emit('close', survey.id)">
        🔒 Cerrar
      </button>

      <!-- Botones de acción -->
      <button class="action-btn view-btn" @click="$emit('view', survey.id)">
        Ver Detalles
      </button>
      <button class="action-btn edit-btn" :disabled="survey.status === 'FINALIZADA'" @click="$emit('edit', survey.id)">
        Editar
      </button>
      <button class="action-btn responses-btn" @click="$emit('responses', survey.id)">
        Respuestas
      </button>
      <button class="action-btn delete-btn" :disabled="survey.status === 'PUBLICADA'"
        :title="survey.status === 'PUBLICADA' ? 'No se puede eliminar una encuesta publicada' : 'Eliminar encuesta'"
        @click="$emit('delete', survey.id)">
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Survey } from '../../types/survey'

interface Props {
  survey: Survey
}

defineProps<Props>()

defineEmits<{
  view: [id: string]
  edit: [id: string]
  responses: [id: string]
  delete: [id: string]
  publish: [id: string]
  close: [id: string]
}>()

/**
 * Obtiene la clase CSS según el estado de la encuesta
 * @param status - Estado de la encuesta
 * @returns Clase CSS correspondiente
 */
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'CREADA': 'status-draft',
    'PUBLICADA': 'status-active',
    'PAUSADA': 'status-paused',
    'FINALIZADA': 'status-finished'
  }
  return classes[status] || 'status-draft'
}

/**
 * Obtiene la etiqueta legible del estado de la encuesta
 * @param status - Estado de la encuesta
 * @returns Etiqueta legible del estado
 */
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'CREADA': 'Borrador',
    'PUBLICADA': 'Activa',
    'PAUSADA': 'Pausada',
    'FINALIZADA': 'Finalizada'
  }
  return labels[status] || 'Desconocido'
}

/**
 * Formatea una fecha para mostrar de forma legible
 * @param dateString - Cadena de fecha ISO
 * @returns Fecha formateada
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Copia el ID de la encuesta al portapapeles
 * @param id - ID de la encuesta a copiar
 */
const copyToClipboard = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id)
    alert('ID copiado al portapapeles')
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = id
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('ID copiado al portapapeles')
  }
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

.status-created {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-paused {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-finished {
  background: rgba(107, 114, 128, 0.1);
  color: var(--text-secondary);
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

/* ✨ NUEVOS ESTILOS PARA LOS BOTONES */
.publish-btn {
  background: var(--success-color, #10b981);
  color: white;
}

.publish-btn:hover {
  background: var(--success-hover, #059669);
}

.close-btn {
  background: var(--warning-color, #f59e0b);
  color: white;
}

.close-btn:hover {
  background: var(--warning-hover, #d97706);
}

/* Estilos para botones deshabilitados */
.action-btn:disabled {
  background: var(--gray-300, #d1d5db);
  color: var(--gray-500, #6b7280);
  cursor: not-allowed;
  opacity: 0.6;
}

.action-btn:disabled:hover {
  background: var(--gray-300, #d1d5db);
}

/* Actualizar colores de estado */
.status-active {
  background: var(--success-color, #10b981);
  color: white;
}

.status-created {
  background: var(--info-color, #3b82f6);
  color: white;
}

.status-finished {
  background: var(--gray-500, #6b7280);
  color: white;
}

.status-paused {
  background: var(--warning-color, #f59e0b);
  color: white;
}

/* ✨ NUEVO: Estilos para el ID y botón de copia */
.stat-id {
  position: relative;
  font-family: 'Courier New', monospace;
  /* Fuente monospace para el ID */
}

.stat-id .stat-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  margin-left: 6px;
  border-radius: 3px;
  font-size: 0.8rem;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  opacity: 1;
  background: var(--gray-100, #f5f5f5);
}

.copy-btn:active {
  transform: scale(0.95);
}

/* Hacer que el ID sea más legible */
.stat-id {
  grid-column: 1 / -1;
  /* Ocupar todo el ancho disponible */
  border-bottom: 1px solid var(--border-light, #e5e7eb);
  padding-bottom: var(--spacing-xs, 4px);
  margin-bottom: var(--spacing-xs, 4px);
}

/* Mejorar el layout de las estadísticas */
.survey-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xs, 4px);
  margin: var(--spacing-md, 12px) 0;
}

/* Las otras estadísticas en una fila */
.survey-stats .stat:not(.stat-id) {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs, 4px);
}

/* Contenedor para las estadísticas que no son ID */
.survey-stats {
  display: block;
}

.stats-row {
  display: flex;
  gap: var(--spacing-md, 12px);
  flex-wrap: wrap;
  margin-top: var(--spacing-xs, 4px);
}
</style>
