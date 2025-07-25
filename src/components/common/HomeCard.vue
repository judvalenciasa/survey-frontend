<template>
  <div class="home-card" @click="$emit('click')">
    <div class="card-header">
      <div class="card-icon">{{ icon }}</div>
      <h3 class="card-title">{{ title }}</h3>
    </div>
    
    <p class="card-description">{{ description }}</p>
    
    <button class="card-button" :class="`button-${buttonColor}`">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
  buttonText: string
  buttonColor: 'primary' | 'secondary'
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>

<style scoped>
.home-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.home-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.card-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.card-button {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-primary {
  background: var(--primary-color);
  color: white;
}

.button-primary:hover {
  background: var(--primary-hover);
}

.button-secondary {
  background: var(--secondary-color);
  color: white;
}

.button-secondary:hover {
  background: #475569;
}

@media (max-width: 768px) {
  .home-card {
    padding: var(--spacing-lg);
  }
  
  .card-icon {
    font-size: 2.5rem;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
}
</style>