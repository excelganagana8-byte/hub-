import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import ChatView from '../views/ChatView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },

    {
      path: '/register',
      name: 'signUp',
      component: RegisterView,
      meta: { guestOnly: true },
    },

    {
      path: '/login',
      name: 'signIn',
      component: LoginView,
      meta: { guestOnly: true },
    },

    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/TeamsView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/teams/:teamId',
      name: 'TeamWorkspace',
      component: () => import('@/views/TeamWorkspace.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Handle Google OAuth redirect
  const token = to.query.token
  const userString = to.query.user

  if (token && userString) {
    try {
      const user = JSON.parse(userString)

      auth.login(user, token)

      // Remove token and user from URL
      return {
        path: to.path,
        query: {},
      }
    } catch (error) {
      console.error('Google authentication error:', error)

      return {
        name: 'signIn',
      }
    }
  }

  // Protected route
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return {
      name: 'signIn',
    }
  }

  // Guest-only route
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return {
      name: 'home',
    }
  }

  return true
})

export default router
