import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/register',
      name: 'signUp',
      component: RegisterView,
    },

    {
      path: '/login',
      name: 'signIn',
      component: LoginView,
    },

    {
      path: '/teams/:teamId',
      name: 'TeamWorkspace',
      component: () => import('@/views/TeamWorkspace.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  const token = to.query.token
  const userString = to.query.user

  if (token && userString) {
    try {
      const user = JSON.parse(userString)

      auth.login(user, token)

      // Remove token and user from the URL
      return {
        path: to.path,
        query: {},
      }
    } catch (error) {
      console.error('Google authentication error:', error)
    }
  }

  return true
})

export default router
