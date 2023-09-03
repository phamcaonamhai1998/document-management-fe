import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { TOKEN_KEY } from './constants/index.constant'

const app = createApp(App)

app.use(createPinia())
app.use(router)

axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token') || localStorage.getItem(TOKEN_KEY)
  // Check if the header property exists
  if (request.headers) {
    if (!request.headers['Authorization']) {
      // Set the Authorization header if it exists
      request.headers['Authorization'] = `Bearer ${token}`
    }
  }

  return request
})

app.use(Antd).mount('#app')
