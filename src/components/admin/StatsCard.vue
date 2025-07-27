<template>
  <div
    class="stats-card"
    :class="`stats-card--${color}`"
  >
    <div class="stats-icon">
      {{ icon }}
    </div>
    <div class="stats-content">
      <h3 class="stats-value">
        {{ value }}
      </h3>
      <p class="stats-title">
        {{ title }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  icon: string
  color: 'primary' | 'success' | 'info' | 'warning'
}

defineProps<Props>()
</script>

<style scoped>
.stats-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  box-shadow: var(--shadow);
  border-left: 4px solid;
  transition: transform 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-card--primary { border-left-color: var(--primary-color); }
.stats-card--success { border-left-color: var(--success-color); }
.stats-card--info { border-left-color: #3b82f6; }
.stats-card--warning { border-left-color: var(--warning-color); }

.stats-icon {
  font-size: 2rem;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.stats-title {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}
</style> 