<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/modules/auth'

const authStore = useAuthStore()

// Inicializar autenticación al cargar la app
onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
@import '@/assets/css/main.css';
</style>
