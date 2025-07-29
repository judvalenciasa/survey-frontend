<!--
/**
 * Vista de edición de encuestas
 * @description Página para modificar encuestas existentes con formulario completo
 * @view SurveyEditView
 */
-->
<template>
  <div class="survey-edit-view">
    <!-- Header -->
    <header class="edit-header">
      <div class="header-content">
        <button
          class="back-btn"
          @click="goBack"
        >
          ← Volver
        </button>
        <div class="header-info">
          <h1>Editar Encuesta</h1>
          <p
            v-if="currentSurvey"
            class="survey-name"
          >
            {{ currentSurvey.name }}
          </p>
        </div>
      </div>
    </header>

    <!-- Loading state -->
    <div
      v-if="surveyStore.loading"
      class="loading-state"
    >
      <div class="loading-spinner" />
      <p>Cargando encuesta...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="error-state"
    >
      <div class="error-icon">
        ❌
      </div>
      <h3>Error al cargar la encuesta</h3>
      <p>{{ error }}</p>
      <button
        class="retry-btn"
        @click="loadSurvey"
      >
        Reintentar
      </button>
    </div>

    <!-- Edit form -->
    <div
      v-else-if="currentSurvey"
      class="edit-content"
    >
      <SurveyEditForm
        :survey="currentSurvey"
        :loading="surveyStore.loading"
        @submit="updateSurvey"
        @cancel="goBack"
      />

      <!-- Modal de éxito -->
      <div
        v-if="showSuccessModal"
        class="modal-overlay"
        @click="closeSuccessModal"
      >
        <div
          class="modal success-modal"
          @click.stop
        >
          <div class="modal-header">
            <h3>¡Encuesta Actualizada!</h3>
            <span class="success-icon">✅</span>
          </div>
          <div class="modal-content">
            <p>Los cambios se han guardado exitosamente.</p>
          </div>
          <div class="modal-actions">
            <button
              class="btn-primary"
              @click="goToSurveyList"
            >
              Ver Lista de Encuestas
            </button>
            <button
              class="btn-secondary"
              @click="closeSuccessModal"
            >
              Continuar Editando
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSurveyStore } from '../../../store/modules/survey'
import type { UpdateSurveyRequest } from '../../../types/survey'
import SurveyEditForm from '../../../components/survey/SurveyEditForm.vue'

/**
 * Vista de edición de encuestas con funcionalidades completas
 * @description Permite modificar encuestas existentes con validación y confirmación
 */

const route = useRoute()
const router = useRouter()
const surveyStore = useSurveyStore()

const error = ref<string | null>(null)
const showSuccessModal = ref(false)

/**
 * ID de la encuesta a editar desde la ruta
 */
const surveyId = computed(() => route.params.id as string)

/**
 * Encuesta actual desde el store
 */
const currentSurvey = computed(() => surveyStore.currentSurvey)

/**
 * Carga la encuesta específica para editar
 */
const loadSurvey = async () => {
  if (!surveyId.value) {
    error.value = 'ID de encuesta no válido'
    return
  }

  try {
    error.value = null
    await surveyStore.fetchSurvey(surveyId.value)
  } catch (err: any) {
    console.error('Error loading survey for edit:', err)
    error.value = err.message || 'Error al cargar la encuesta'
  }
}

/**
 * Actualiza la encuesta con los nuevos datos
 * @param data - Datos actualizados de la encuesta
 */
const updateSurvey = async (data: UpdateSurveyRequest) => {
  try {
    await surveyStore.updateSurvey(surveyId.value, data)
    showSuccessModal.value = true
  } catch (err: any) {
    console.error('Error updating survey:', err)
    error.value = err.message || 'Error al actualizar la encuesta'
  }
}

/**
 * Navega hacia atrás
 */
const goBack = () => {
  router.back()
}

/**
 * Navega hacia la lista de encuestas
 */
const goToSurveyList = () => {
  router.push('/admin/surveys')
}

/**
 * Cierra el modal de éxito
 */
const closeSuccessModal = () => {
  showSuccessModal.value = false
}

// Lifecycle
onMounted(() => {
  loadSurvey()
})
</script>

<style scoped>
.survey-edit-view {
  padding: var(--spacing-lg);
  max-width: 1000px;
  margin: 0 auto;
}

.edit-header {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.back-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--bg-tertiary);
}

.header-info h1 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  font-size: 1.75rem;
}

.survey-name {
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-lg) auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.retry-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  cursor: pointer;
  margin-top: var(--spacing-md);
}

.edit-content {
  position: relative;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.success-modal {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  background: var(--success-color);
  color: white;
}

.modal-header h3 {
  margin: 0;
}

.success-icon {
  font-size: 1.5rem;
}

.modal-content {
  padding: var(--spacing-xl);
  text-align: center;
}

.modal-content p {
  margin: 0;
  color: var(--text-secondary);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-sm) var(--spacing-lg);
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

.btn-primary:hover {
  background: var(--primary-hover);
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
  .survey-edit-view {
    padding: var(--spacing-md);
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>