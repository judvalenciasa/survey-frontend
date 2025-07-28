<template>
  <div class="survey-create-view">
    <header class="page-header">
      <h1>Crear Nueva Encuesta</h1>
      <p class="page-description">
        Diseña una encuesta personalizada con múltiples tipos de preguntas
      </p>
    </header>

    <SurveyForm
      :loading="surveyStore.loading"
      @submit="createSurvey"
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
          <h3>¡Encuesta Creada Exitosamente!</h3>
        </div>
        <div class="modal-body">
          <div class="success-icon">
            ✅
          </div>
          <p>Tu encuesta <strong>{{ createdSurveyName }}</strong> ha sido creada correctamente.</p>
          <p>Ya puedes encontrarla en tu lista de encuestas.</p>
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
            @click="createAnother"
          >
            Crear Otra Encuesta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '../../store/modules/survey'
import type { CreateSurveyRequest } from '../../types/survey'
import SurveyForm from '../../components/survey/SurveyForm.vue'

const router = useRouter()
const surveyStore = useSurveyStore()

// Estado
const showSuccessModal = ref(false)
const createdSurveyName = ref('')

// Métodos
const createSurvey = async (data: CreateSurveyRequest) => {
  try {
    const createdSurvey = await surveyStore.createSurvey(data)
    createdSurveyName.value = createdSurvey.name
    showSuccessModal.value = true
  } catch (error) {
    console.error('Error creating survey:', error)
    // El error ya está manejado en el store y se muestra en el formulario
  }
}

const goBack = () => {
  router.push('/admin/surveys')
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  goToSurveyList()
}

const goToSurveyList = () => {
  showSuccessModal.value = false
  router.push('/admin/surveys')
}

const createAnother = () => {
  showSuccessModal.value = false
  // Limpiar errores y recargar la página para un formulario limpio
  surveyStore.clearError()
  window.location.reload()
}

// Limpiar errores al entrar a la vista
surveyStore.clearError()
</script>

<style scoped>
.survey-create-view {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: var(--spacing-xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.page-header h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
  font-weight: 700;
}

.page-description {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.6;
}

/* Modal de éxito */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
}

.success-modal {
  text-align: center;
}

.modal-header {
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.modal-body {
  padding: var(--spacing-xl);
}

.success-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.modal-body p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.modal-body p:last-child {
  margin-bottom: 0;
}

.modal-actions {
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-xl);
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-md) var(--spacing-lg);
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
  transform: translateY(-1px);
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
  .survey-create-view {
    padding: var(--spacing-lg);
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-overlay {
    padding: var(--spacing-md);
  }
}
</style>
