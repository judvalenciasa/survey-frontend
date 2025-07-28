<!--
/**
 * Componente raíz de la aplicación Vue
 * @description Contiene el RouterView principal y maneja la inicialización de la autenticación
 * @author Sistema de Formularios STyT
 */
-->
<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from 'vue'
import { useAuthStore } from './store/modules/auth'

const authStore = useAuthStore()

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
