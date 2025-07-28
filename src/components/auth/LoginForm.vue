<template>
  <div
    class="card"
    style="max-width: 400px; margin: 0 auto;"
  >
    <h2 class="text-center mb-md">
      Iniciar Sesión
    </h2>

    <form
      class="flex flex-col gap-md"
      @submit.prevent="handleSubmit"
    >
      <!-- Campo Usuario -->
      <div class="form-group">
        <label
          for="username"
          class="form-label"
        >Usuario</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          class="form-input"
          :class="{ error: errors.username }"
          placeholder="Ingresa tu usuario"
          required
        >
        <span
          v-if="errors.username"
          class="form-error"
        >
          {{ errors.username }}
        </span>
      </div>

      <!-- Campo Contraseña -->
      <div class="form-group">
        <label
          for="password"
          class="form-label"
        >Contraseña</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="form-input"
          :class="{ error: errors.password }"
          placeholder="Ingresa tu contraseña"
          required
        >
        <span
          v-if="errors.password"
          class="form-error"
        >
          {{ errors.password }}
        </span>
      </div>

      <!-- Error general -->
      <div
        v-if="authError"
        class="form-error text-center"
      >
        {{ authError }}
      </div>

      <!-- Botón submit -->
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="loading"
      >
        <span v-if="loading">Cargando...</span>
        <span v-else>Iniciar Sesión</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/modules/auth'
import type { LoginRequest } from '../../types/auth'

const router = useRouter()
const authStore = useAuthStore()

// Estado del formulario
const form = ref<LoginRequest>({
  username: '',
  password: ''
})

const errors = ref<{ [key: string]: string }>({})

// Estados computados
const loading = computed(() => authStore.loading)
const authError = computed(() => authStore.error)

// Validación simple
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

// Manejar envío del formulario

const handleSubmit = async () => {
  if (!validateForm()) return

  const result = await authStore.login(form.value)

  if (result.success) {
    router.push('/admin/dashboard')
  }
}

</script>