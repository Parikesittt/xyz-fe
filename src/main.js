import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useThemeStore } from './stores/theme'

import App from './App.vue'
import router from './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsComponents from '@/components/DocsComponents'
import DocsExample from '@/components/DocsExample'
import DocsIcons from '@/components/DocsIcons'
import axios from 'axios'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';
import { useAuthStore } from '@/stores/auth'
import api from '@/api/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(CoreuiVue)

const themeStore = useThemeStore()
themeStore.initialize()

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      // Use a class selector that we'll toggle
      darkModeSelector: '.dark-mode',
      cssLayer: false
    }
  }
});
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsIcons', DocsIcons)
