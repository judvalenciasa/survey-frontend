/**
 * Punto de entrada principal de la aplicación Vue
 * Configura el store de Pinia, el router y monta la aplicación
 * @description Inicializa la autenticación antes de montar la aplicación
 */
import { createApp } from 'vue'
import router from '@/router'
import { pinia } from '@/store'  // 👈 Usar instancia configurada
import { useAuthStore } from '@/store'
import './style.css'
import App from './App.vue'

const app = createApp(App)


app.use(pinia)
app.use(router)


const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.mount('#app')
})
