import { createApp } from 'vue'
import App from './app/App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css'
import './styles.scss'
import { router } from "@/router";

const app = createApp(App)

app.use(ToastService)
app.use(ConfirmationService)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
})

app.mount('#app')
