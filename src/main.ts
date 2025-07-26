import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import { useAuthStore } from '@/store/modules/auth'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ✨ AGREGAR ESTA INICIALIZACIÓN
// Inicializar autenticación antes de montar la app
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.mount('#app')
})
