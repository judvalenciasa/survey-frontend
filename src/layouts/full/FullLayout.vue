<template>
  <div class="full-layout">
    <!-- Header/Navbar público -->
    <AppNavbar />
      
    <!-- Contenido principal -->
    <main class="full-main">
      <router-view />
    </main>
      
    <!-- Footer -->
    <AppFooter />
  </div>
</template>
  
  <script setup lang="ts">
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
    /* El contenido decide su propio espaciado y background */
  }
  </style>