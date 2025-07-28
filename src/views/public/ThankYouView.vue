<!--
/**
 * Vista de agradecimiento tras completar encuesta
 * @description Página de confirmación con animación y opciones de navegación
 * @view ThankYouView
 */
-->
<template>
  <div class="thank-you-page">
    <div class="thank-you-container">
      <div class="success-animation">
        <div class="checkmark">
          <svg
            viewBox="0 0 100 100"
            class="checkmark-svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              stroke-width="3"
              class="checkmark-circle"
            />
            <path
              d="M25 50 L40 65 L75 30"
              fill="none"
              stroke="#10b981"
              stroke-width="4"
              stroke-linecap="round"
              class="checkmark-check"
            />
          </svg>
        </div>
      </div>
      
      <h1 class="thank-you-title">
        ¡Gracias por participar!
      </h1>
      <p class="thank-you-message">
        Tu respuesta ha sido enviada exitosamente. Apreciamos el tiempo que dedicaste a completar nuestra encuesta.
      </p>
      
      <div class="thank-you-actions">
        <button
          class="btn-primary"
          @click="goHome"
        >
          Volver al inicio
        </button>
        <button
          class="btn-secondary"
          @click="goToSurveyAccess"
        >
          Responder otra encuesta
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Vista de confirmación tras envío exitoso de encuesta
 * @description Página con animación de éxito y opciones de navegación
 */
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Navega hacia la página de inicio
 */
const goHome = () => {
  router.push('/')
}

/**
 * Navega hacia la página de presentación de encuestas
 */
const goToSurveyAccess = () => {
  router.push('/survey-presentation')
}
</script>

<style scoped>
.thank-you-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  padding: var(--spacing-xl);
}

.thank-you-container {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.success-animation {
  margin-bottom: var(--spacing-2xl);
}

.checkmark {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  position: relative;
}

.checkmark-svg {
  width: 100%;
  height: 100%;
}

.checkmark-circle {
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  animation: circle-draw 1s ease-out forwards;
}

.checkmark-check {
  stroke-dasharray: 70;
  stroke-dashoffset: 70;
  animation: check-draw 0.5s ease-out 1s forwards;
}

@keyframes circle-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes check-draw {
  to {
    stroke-dashoffset: 0;
  }
}

.thank-you-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary-color), #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.thank-you-message {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
}

.thank-you-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .thank-you-page {
    padding: var(--spacing-lg);
  }
  
  .thank-you-title {
    font-size: 2rem;
  }
  
  .thank-you-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 250px;
  }
  
  .checkmark {
    width: 100px;
    height: 100px;
  }
}

/* Animación adicional para darle más vida */
.thank-you-container {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 