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
