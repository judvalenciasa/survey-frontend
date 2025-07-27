<template>
  <div class="validation-message">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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

/* Animación de entrada */
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
