<template>
  <div class="survey-list">
    <header class="list-header">
      <h1>Mis Encuestas</h1>
      <router-link to="/admin/surveys/create" class="create-btn">
        Crear Nueva Encuesta
      </router-link>
    </header>

    <div class="list-filters">
      <div class="filter-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar encuestas..."
          class="search-input"
        />
        <select v-model="statusFilter" class="status-filter">
          <option value="">Todas</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
        </select>
      </div>
    </div>

    <div v-if="surveyStore.loading" class="loading">
      Cargando encuestas...
    </div>

    <div v-else-if="surveyStore.error" class="error">
      {{ surveyStore.error }}
    </div>

    <div v-else-if="filteredSurveys.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>No tienes encuestas aún</h3>
      <p>Crea tu primera encuesta para comenzar</p>
      <router-link to="/admin/surveys/create" class="create-btn">
        Crear Primera Encuesta
      </router-link>
    </div>

    <div v-else class="surveys-grid">
      <SurveyCard
        v-for="survey in filteredSurveys"
        :key="survey.id"
        :survey="survey"
        @view="viewSurvey"
        @edit="editSurvey"
        @responses="viewResponses"
        @delete="confirmDelete"
      />
    </div>

    <!-- Modal de confirmación -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Eliminar Encuesta"
      message="¿Estás seguro de que quieres eliminar esta encuesta? Esta acción no se puede deshacer."
      @confirm="deleteSurvey"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '@/store/modules/survey'
import SurveyCard from '@/components/survey/SurveyCard.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const surveyStore = useSurveyStore()

const searchQuery = ref('')
const statusFilter = ref('')
const showDeleteModal = ref(false)
const surveyToDelete = ref<string | null>(null)

const filteredSurveys = computed(() => {
  let filtered = surveyStore.surveys

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(survey => 
      survey.title.toLowerCase().includes(query) ||
      survey.description.toLowerCase().includes(query) ||
      survey.code.toLowerCase().includes(query)
    )
  }

  // Filtrar por estado
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(survey => survey.isActive)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(survey => !survey.isActive)
  }

  return filtered
})

const viewSurvey = (id: string) => {
  router.push(`/admin/surveys/${id}`)
}

const editSurvey = (id: string) => {
  router.push(`/admin/surveys/${id}/edit`)
}

const viewResponses = (id: string) => {
  router.push(`/admin/surveys/${id}/responses`)
}

const confirmDelete = (id: string) => {
  surveyToDelete.value = id
  showDeleteModal.value = true
}

const deleteSurvey = async () => {
  if (surveyToDelete.value) {
    try {
      await surveyStore.deleteSurvey(surveyToDelete.value)
      showDeleteModal.value = false
      surveyToDelete.value = null
    } catch (error) {
      console.error('Error al eliminar encuesta:', error)
    }
  }
}

onMounted(() => {
  surveyStore.fetchSurveys()
})
</script>

<style scoped>
.survey-list {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.list-header h1 {
  color: var(--text-primary);
  font-size: 2rem;
  margin: 0;
}

.create-btn {
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease;
}

.create-btn:hover {
  background: var(--primary-hover);
}

.list-filters {
  margin-bottom: var(--spacing-xl);
}

.filter-group {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.search-input {
  flex: 1;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.status-filter {
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background: var(--bg-primary);
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-secondary);
}

.error {
  color: var(--error-color);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.surveys-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .surveys-grid {
    grid-template-columns: 1fr;
  }
}
</style>
