import axios from 'axios';
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // penting kalau pakai http-only cookie
});

// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Kalau 401, artinya token expired atau tidak valid
//       const authStore = useAuthStore()
//       authStore.logout()
//       router.push({ name: 'Login' })
//     }
//     return Promise.reject(error)
//   }
// )

export default api;
