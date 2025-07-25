<template>
  <div class="survey-page">
    <AppNavbar />
    
    <main class="survey-main">
      <div class="survey-container">
        <h1 class="survey-title">Acceso a Encuesta</h1>
        <p class="survey-subtitle">Ingresa el código de la encuesta para comenzar</p>
        
        <div class="survey-form">
          <input 
            v-model="surveyCode"
            type="text" 
            placeholder="Código de encuesta"
            class="survey-input"
            @keyup.enter="accessSurvey"
          />
          <button 
            @click="accessSurvey"
            class="survey-button"
            :disabled="!surveyCode"
          >
            Acceder
          </button>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const router = useRouter()
const surveyCode = ref('')

const accessSurvey = () => {
  if (surveyCode.value) {
    // Aquí irá la lógica para validar y acceder a la encuesta
    console.log('Accessing survey with code:', surveyCode.value)
    // router.push(`/survey/${surveyCode.value}`)
  }
}
</script>

<style scoped>
.survey-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.survey-main {
  flex: 1;
  display: flex;
  align-items: center;
  padding: var(--spacing-2xl) var(--spacing-md);
}

.survey-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.survey-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.survey-subtitle {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.survey-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.survey-input {
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  text-align: center;
}

.survey-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.survey-button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.survey-button:hover:not(:disabled) {
  background: var(--primary-hover);
}

.survey-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
