import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  //state
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
          this.logout
        }
      }
    },
  },
})
