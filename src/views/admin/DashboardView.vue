<template>
    <div class="container">
      <div class="flex justify-between items-center mb-md">
        <h1>Dashboard</h1>
        <button @click="logout" class="btn btn-secondary">
          Cerrar Sesión
        </button>
      </div>
      
      <div class="card">
        <h2>Bienvenido, {{ user?.firstName }}!</h2>
        <p>Este es tu panel principal.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/modules/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const user = computed(() => authStore.user)
  
  const logout = () => {
    authStore.logout()
    router.push('/login')
  }
  </script>