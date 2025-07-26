<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-icon">📊</span>
          <span class="footer-name">{{ appName }}</span>
        </div>

        <div class="footer-links">
          <a href="#" class="footer-link">Términos</a>
          <a href="#" class="footer-link">Privacidad</a>
          <a href="#" class="footer-link">Soporte</a>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-text">
          © {{ currentYear }} {{ appName }}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appName = import.meta.env.VITE_APP_NAME || 'FormSTyT'
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--text-primary);
  background-color: var(--primary-color);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md) var(--spacing-md);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.footer-brand {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--text-secondary);
}

.footer-icon {
  font-size: 1.25rem;
  margin-right: var(--spacing-sm);
}


.footer-links {
  display: flex;
  gap: var(--spacing-lg);
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-color);
}

.footer-bottom {
  padding-top: var(--spacing-lg);
  text-align: center;
}

.footer-text {
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .footer-links {
    gap: var(--spacing-md);
  }
}
</style>