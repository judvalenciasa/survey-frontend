<template>
  <div
    class="modal-overlay"
    @click="$emit('cancel')"
  >
    <div
      class="modal-content"
      @click.stop
    >
      <h3 class="modal-title">
        {{ title }}
      </h3>
      <p class="modal-message">
        {{ message }}
      </p>
        
      <div class="modal-actions">
        <button 
          class="btn btn-secondary"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
        <button 
          class="btn btn-danger"
          @click="$emit('confirm')"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  interface Props {
    title: string
    message: string
  }
  
  defineProps<Props>()
  
  defineEmits<{
    confirm: []
    cancel: []
  }>()
  </script>
  
  <style scoped>
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
  
  .modal-content {
    background: var(--bg-primary);
    border-radius: var(--border-radius);
    padding: var(--spacing-xl);
    max-width: 400px;
    width: 90%;
    box-shadow: var(--shadow-lg);
  }
  
  .modal-title {
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
    font-size: 1.25rem;
  }
  
  .modal-message {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xl);
    line-height: 1.5;
  }
  
  .modal-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
  }
  
  .btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }
  
  .btn-danger {
    background: var(--error-color);
    color: white;
  }
  
  .btn:hover {
    opacity: 0.8;
  }
  </style>


