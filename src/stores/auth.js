import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'
import api from '@/api/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    permissions: []
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    }
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/api/login', credentials)

        if (response.data.success) {
          this.user = response.data.user
          this.permissions = response.data.permissions

          localStorage.setItem('is_branch', response.data.user.is_branch)
          localStorage.setItem('group_id', response.data.user.group_id)

          return true
        }
        return false
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await api.post('/api/logout')
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        this.user = null
        this.permissions = []
        localStorage.removeItem('is_branch')
        localStorage.removeItem('group_id')
      }
    },

    async checkAuth() {
      try {
        const response = await api.get('/api/check')
        this.user = response.data.user
        this.permissions = response.data.permissions;
        return true
      } catch {
        this.logout()
        return false
      }
    }
  }
})
