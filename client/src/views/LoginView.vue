<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthenticationService from '@/services/AuthenticationService'

const router = useRouter()
const auth = useAuthStore()

const usernameOrEmail = ref('')
const password = ref('')
const errors = ref([])

const loginWithGoogle = () => {
  window.location.href = 'https://collab-x-api.onrender.com/auth/google'
}

const login = async () => {
  errors.value = []

  try {
    const response = await AuthenticationService.signin({
      usernameOrEmail: usernameOrEmail.value,
      password: password.value,
    })

    const { token, user } = response.data.data

    auth.login(user, token)

    alert(response.data.message || `Welcome Back ${user.username}`)

    router.push('/')
  } catch (err) {
    const data = err.response?.data

    if (Array.isArray(data?.errors)) {
      errors.value = data.errors.map((e) => e.message)
    } else if (data?.message) {
      errors.value = [data.message]
    } else {
      errors.value = ['Something went wrong. Please try again.']
    }
  }
}
</script>

<template>
  <div class="bg-white flex flex-col min-h-screen w-full">
    <div class="flex-1 flex flex-col justify-center items-center w-full py-8">
      <div class="flex flex-col justify-center items-center w-full max-w-sm px-4">
        <!-- Logo -->
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mb-2"
        >
          <path
            d="M24 41.5C23.5 41.5 23 41.3 22.6 40.9C16.5 35.2 12 31 9 27C4 21 4 15.5 4 12C4 6.5 8.5 2 14 2C17.5 2 20.8 3.8 23 6.5C25.2 3.8 28.5 2 32 2C37.5 2 42 6.5 42 12C42 15.5 42 21 37 27C34 31 29.5 35.2 23.4 40.9C23 41.3 22.5 41.5 24 41.5Z"
            fill="#EA4C89"
          />
          <path
            d="M19 26L23 30L27 26"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21 18L17 14L13 18"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M17 14V22" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M23 30V22" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>

        <!-- Title -->
        <h1 class="font-semibold mb-6 text-xl text-gray-800 mt-4">Sign in to CollabX</h1>

        <!-- Login Form -->
        <form @submit.prevent="login" class="flex flex-col w-full space-y-4">
          <!-- Username / Email -->
          <div>
            <label for="usernameOrEmail" class="text-sm font-medium text-gray-700">
              Username or email address
            </label>

            <input
              v-model="usernameOrEmail"
              type="text"
              id="usernameOrEmail"
              class="mt-1 border border-gray-300 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <!-- Password -->
          <div>
            <div class="flex justify-between items-center">
              <label for="password" class="text-sm font-medium text-gray-700"> Password </label>

              <button type="button" class="text-blue-600 hover:underline text-sm cursor-pointer">
                Forgot password?
              </button>
            </div>

            <input
              v-model="password"
              type="password"
              id="password"
              class="mt-1 border border-gray-300 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <!-- Errors -->
          <div v-if="errors.length">
            <div v-for="(err, i) in errors" :key="i" class="text-red-500">
              {{ err }}
            </div>
          </div>

          <!-- Sign In -->
          <button
            type="submit"
            class="w-full mt-2 rounded-md py-2.5 bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center justify-center w-full my-6">
          <div class="flex-grow h-px bg-gray-300"></div>
          <span class="px-4 text-gray-500 text-sm font-medium">or</span>
          <div class="flex-grow h-px bg-gray-300"></div>
        </div>

        <!-- Social Buttons -->
        <div class="flex flex-col gap-3 w-full">
          <!-- Google -->
          <button
            type="button"
            @click="loginWithGoogle"
            class="flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 cursor-pointer"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>

            Continue with Google
          </button>

          <!-- Apple -->
          <button
            type="button"
            class="flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 cursor-pointer"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              />
            </svg>

            Continue with Apple
          </button>
        </div>

        <!-- Links -->
        <div class="text-center mt-6 space-y-3">
          <p class="text-sm text-gray-600">
            New to CollabX?

            <RouterLink to="/register" class="text-blue-600 hover:underline">
              Create an account
            </RouterLink>
          </p>

          <p class="text-sm">
            <RouterLink to="/passkey" class="text-blue-600 hover:underline font-medium">
              Sign in with a passkey
            </RouterLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="w-full bg-gray-100 border-t border-gray-200 py-4">
      <div class="max-w-6xl mx-auto px-4">
        <div
          class="flex flex-col items-center md:flex-row md:justify-center md:items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-gray-600"
        >
          <RouterLink to="/terms" class="hover:text-blue-600 hover:underline"> Terms </RouterLink>

          <RouterLink to="/privacy" class="hover:text-blue-600 hover:underline">
            Privacy
          </RouterLink>

          <RouterLink to="/docs" class="hover:text-blue-600 hover:underline"> Docs </RouterLink>

          <RouterLink to="/contact" class="hover:text-blue-600 hover:underline">
            Contact CollabX Support
          </RouterLink>

          <RouterLink to="/cookies" class="hover:text-blue-600 hover:underline">
            Manage Cookies
          </RouterLink>

          <RouterLink to="/donotshare" class="hover:text-blue-600 hover:underline">
            Do not Share my personal information
          </RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>
