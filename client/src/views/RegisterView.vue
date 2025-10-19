<script setup>
import { ref } from 'vue'
import AuthenticationService from '@/services/AuthenticationService'

const email = ref('')
const password = ref('')
const username = ref('')
const errors = ref({})

const registerUser = async () => {
  errors.value = {} // clear previous errors

  try {
    const response = await AuthenticationService.register({
      email: email.value,
      password: password.value,
      username: username.value,
    })
    alert(response.data.message)
  } catch (err) {
    const data = err.response?.data

    // Case 1: Object-based errors (from backend)
    if (data?.errors && typeof data.errors === 'object') {
      errors.value = data.errors
    }
    // Case 2: General error (like user already exists)
    else if (data?.message) {
      errors.value.general = data.message
    }
    // Fallback
    else {
      errors.value.general = 'Something went wrong. Please retry.'
    }
  }
}
</script>

<template>
  <!-- Full Page Container -->
  <div class="w-full flex flex-col min-h-screen md:flex-row bg-gray-50">
    <!-- LEFT SECTION - Enhanced with gradient and better spacing -->
    <div
      class="bg-gradient-to-br from-gray-900 to-black text-white flex flex-col justify-start items-center md:w-1/2 p-8 text-center relative overflow-hidden"
    >
      <!-- Decorative elements -->
      <div
        class="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full -translate-x-16 -translate-y-16 opacity-20"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 rounded-full translate-x-20 translate-y-20 opacity-20"
      ></div>

      <div class="relative z-10 max-w-md">
        <h1 class="text-4xl font-bold mt-12 mb-6 tracking-tight">Create Your Free Account</h1>
        <p class="text-lg text-gray-300 mb-12 leading-relaxed">
          Join millions of developers and teams building amazing things together on GitHub.
        </p>

        <!-- Feature highlights -->
        <div class="space-y-4 text-left">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div>
              <h3 class="font-semibold">Unlimited repositories</h3>
              <p class="text-gray-400 text-sm">
                Public and private repositories for all your projects
              </p>
            </div>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-400 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
              ></path>
            </svg>
            <div>
              <h3 class="font-semibold">Collaborate with teams</h3>
              <p class="text-gray-400 text-sm">Invite collaborators and work together seamlessly</p>
            </div>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-purple-400 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div>
              <h3 class="font-semibold">Advanced security</h3>
              <p class="text-gray-400 text-sm">Keep your code secure with advanced features</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SECTION - Enhanced with better card design -->
    <div class="flex-1 flex flex-col justify-center items-center p-6 md:p-8 overflow-y-auto">
      <div class="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <div class="flex justify-end mb-6">
          <span class="text-sm text-gray-600">
            Already have an account?
            <button
              class="text-blue-600 font-medium hover:text-blue-800 transition-colors cursor-pointer ml-1"
            >
              Sign in
            </button>
          </span>
        </div>

        <h1 class="font-bold text-3xl text-gray-800 mb-2 text-center">Sign Up for GitHub</h1>
        <p class="text-gray-600 text-center mb-8">Join the world's largest developer community</p>

        <!-- Social Buttons with SVG icons -->
        <div class="flex flex-col gap-3">
          <button
            class="flex items-center cursor-pointer justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
          <button
            class="flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 cursor-pointer"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              />
            </svg>
            Continue with Apple
          </button>
        </div>

        <!-- Divider -->
        <div class="flex items-center my-6">
          <div class="flex-grow h-px bg-gray-300"></div>
          <span class="px-4 text-gray-500 text-sm font-medium">or</span>
          <div class="flex-grow h-px bg-gray-300"></div>
        </div>

        <!-- Input Fields with improved styling -->
        <form @submit.prevent="registerUser" class="flex flex-col gap-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="email"
              id="email"
              type="email"
              placeholder="Enter your email"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">⚠️ {{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2"
              >Password</label
            >
            <input
              v-model="password"
              id="password"
              type="password"
              placeholder="Create a password"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">⚠️ {{ errors.password }}</p>
            <span class="text-xs text-gray-500 mt-2 block">
              Password should be at least 15 characters OR at least 8 characters including a number
              and a lowercase letter.
            </span>
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2"
              >Username</label
            >
            <input
              v-model="username"
              id="username"
              type="text"
              placeholder="Choose a username"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p v-if="errors.username" class="text-red-500 text-sm mt-1">⚠️ {{ errors.username }}</p>
            <span class="text-xs text-gray-500 mt-2 block">
              Username can only contain alphanumeric characters or single hyphens and cannot begin
              or end with a hyphen.
            </span>
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 mb-2"
              >Country / Region</label
            >
            <select
              id="country"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select your country</option>
              <option>Nigeria</option>
              <option>United States</option>
              <option>United Kingdom</option>
            </select>
          </div>
          <!-- General Errors-->
          <p v-if="errors.general" class="text-red-500 text-sm text-center mt-2">
            ⚠️ {{ errors.general }}
          </p>
          <!-- Submit Button -->
          <button
            type="submit"
            class="bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors mt-2 w-full shadow-md cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <!-- Terms notice -->
        <p class="text-xs text-gray-500 text-center mt-6">
          By creating an account, you agree to the
          <a href="#" class="text-blue-600 hover:underline">Terms of Service</a>. For more
          information about GitHub's privacy practices, see the
          <a href="#" class="text-blue-600 hover:underline">GitHub Privacy Statement</a>.
        </p>
      </div>
    </div>
  </div>
</template>
