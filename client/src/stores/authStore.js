import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,

    user: (() => {
      try {
        const userString = localStorage.getItem('user')

        return userString ? JSON.parse(userString) : null
      } catch {
        localStorage.removeItem('user')
        return null
      }
    })(),
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.token),
  },

  actions: {
    login(user, token) {
      this.user = user
      this.token = token

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.user = null
      this.token = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    loadUser() {
      const token = localStorage.getItem('token')
      const userString = localStorage.getItem('user')

      if (token && userString) {
        try {
          this.token = token
          this.user = JSON.parse(userString)
        } catch {
          this.logout()
        }
      }
    },

    async refreshToken() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })

        if (!response.ok) {
          this.logout()
          return false
        }

        const data = await response.json()

        this.token = data.token

        localStorage.setItem('token', data.token)

        return true
      } catch (error) {
        console.error('Token refresh failed:', error)

        this.logout()
        return false
      }
    },
  },
})
