<!--
/**
 * Componente de mensaje de validación
 * @description Muestra mensajes de error con icono y animación
 * @component ValidationMessage
 */
-->
<template>
  <div class="validation-message">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Componente para mostrar mensajes de validación de formularios
 * @description Renderiza mensajes de error con estilos consistentes
 */
export default defineComponent({
  name: 'ValidationMessage',
  props: {

    message: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
.validation-message {
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs, 4px);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs, 4px);
}

.validation-message::before {
  content: "⚠️";
  font-size: 0.75rem;
}

.validation-message {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
