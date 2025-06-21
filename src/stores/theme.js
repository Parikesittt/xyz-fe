import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // Inisialisasi dari localStorage
  const theme = ref(localStorage.getItem('system') || 'light')

  // Watch perubahan tema
  watch(theme, (newTheme) => {
    // Simpan ke localStorage
    localStorage.setItem('system', newTheme)

    // Update kelas di HTML element untuk PrimeVue
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }

    // Trigger event untuk notifikasi komponen PrimeVue
    document.dispatchEvent(new CustomEvent('primevue-theme-change', {
      detail: { theme: newTheme }
    }))
  })

  const toggleTheme = (_theme) => {
    theme.value = _theme
  }

  // Fungsi inisialisasi untuk setup awal
  const initialize = () => {
    // Setup kelas HTML untuk PrimeVue
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }

  return { theme, toggleTheme, initialize }
})
