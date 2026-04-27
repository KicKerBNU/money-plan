import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import { registerFontAwesome } from './plugins/fontawesome'
import { initializeFirebaseAnalytics } from './plugins/firebase'
import { useAuthStore } from './modules/auth/store/auth.store'
import { useThemeStore } from './modules/theme/store/theme.store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

registerFontAwesome(app)
void initializeFirebaseAnalytics()
useThemeStore().init()
useAuthStore().init()

app.mount('#app')
