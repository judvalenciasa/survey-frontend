<!--
/**
 * Layout completo para páginas públicas
 * @description Layout con navbar, contenido y footer para rutas públicas
 * @component FullLayout
 */
-->
<template>
  <div class="full-layout">
    <AppNavbar />
      
    <main class="full-main">
      <router-view />
    </main>
      
    <AppFooter />
  </div>
</template>
  
<script setup lang="ts">

/**
 * Layout principal para páginas públicas y de autenticación
 * @description Combina navbar, contenido y footer en un diseño completo
 */
import AppNavbar from '@/layouts/defaulLayouts/AppNavbar.vue' 
import AppFooter from '@/layouts/defaulLayouts/AppFooter.vue'
</script>
  
<style scoped>
  .full-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .full-main {
    flex: 1;
    width: 100%;
  }
</style>