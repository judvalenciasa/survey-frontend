<!--
/**
 * Formulario de autenticación de usuarios
 * @description Maneja el login con validación de campos y manejo de errores
 * @component LoginForm
 */
-->
<template>
  <div class="card" style="max-width: 400px; margin: 0 auto;">
    <h2 class="text-center mb-md">
      Iniciar Sesión
    </h2>

    <form class="flex flex-col gap-md" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username" class="form-label">Usuario</label>
        <input id="username" v-model="form.username" type="text" class="form-input" :class="{ error: errors.username }"
          placeholder="Ingresa tu usuario" autocomplete="username" required>
        <span v-if="errors.username" class="form-error">
          {{ errors.username }}
        </span>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Contraseña</label>
        <input id="password" v-model="form.password" type="password" class="form-input"
          :class="{ error: errors.password }" placeholder="Ingresa tu contraseña" autocomplete="current-password"
          required>
        <span v-if="errors.password" class="form-error">
          {{ errors.password }}
        </span>
      </div>

      <!-- Error general -->
      <div v-if="authError" class="form-error text-center">
        {{ authError }}
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">Cargando...</span>
        <span v-else>Iniciar Sesión</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * Componente de formulario de login con validación
 * @description Gestiona la autenticación de usuarios con validación y manejo de estados
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/modules/auth'
import type { LoginRequest } from '../../types/auth'

const router = useRouter()
const authStore = useAuthStore()

/**
 * Estado reactivo del formulario de login
 */
const form = ref<LoginRequest>({
  username: '',
  password: ''
})

/**
 * Errores de validación por campo
 */
const errors = ref<{ [key: string]: string }>({})

/**
 * Estado de carga desde el store de autenticación
 */
const loading = computed(() => authStore.loading)

/**
 * Error de autenticación desde el store
 */
const authError = computed(() => authStore.error)

/**
 * Valida los campos del formulario
 * @returns true si la validación es exitosa
 */
const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.username.trim()) {
    errors.value.username = 'El usuario es obligatorio'
  }

  if (!form.value.password) {
    errors.value.password = 'La contraseña es obligatoria'
  }

  return Object.keys(errors.value).length === 0
}

/**
 * Maneja el envío del formulario
 * @description Valida campos y ejecuta login, redirigiendo en caso de éxito
 */
const handleSubmit = async () => {
  if (!validateForm()) return

  const result = await authStore.login(form.value)

  if (result.success) {
    router.push('/admin/dashboard')
  }
}
</script>