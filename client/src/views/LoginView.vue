<script setup></script>

<template>
  <div class="bg-white flex flex-col justify-center items-center w-full h-screen">
    <svg
      aria-hidden="true"
      focusable="false"
      class="octicon octicon-mark-github SessionsAuthHeader-module__avatarCoinGithub--Gu21L"
      viewBox="0 0 24 24"
      width="48"
      height="48"
      fill="currentColor"
      display="inline-block"
      overflow="visible"
      style="vertical-align: text-bottom"
    >
      <path
        d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"
      ></path>
    </svg>
    <h1 class="font-bold mb-10 text-xl text-gray-800">Sign in to GitHub</h1>

    <form class="flex flex-col w-full px-5 sm:w-[50%] md:w-[50%] lg:w-[30%] space-y-2">
      <label for="username/email" class="text-sm">Username or email adress</label>
      <input type="text" id="username/email" class="border px-2 py-1 rounded-md w-full" />

      <div class="flex justify-between">
        <label for="password" class="text-sm">Password</label>
        <button class="text-blue-600 cursor-pointer hover:underline text-sm">
          Forgot pasword?
        </button>
      </div>
      <input type="password" id="password" class="border px-2 py-1 rounded-md" />

      <button
        type="submit"
        class="border mt-4 rounded-md p-1 bg-green-600 text-white hover:bg-green-700 cursor-pointer"
      >
        Sign In
      </button>
    </form>

    <!-- Divider -->
    <div class="flex items-center justify-center w-full max-w-md my-6 px-5">
      <div class="flex-grow h-px bg-gray-300"></div>
      <span class="px-4 text-gray-500 text-sm font-medium">or</span>
      <div class="flex-grow h-px bg-gray-300"></div>
    </div>

    <!-- Social Buttons with SVG icons -->
    <div class="flex flex-col gap-3 w-full px-5 sm:w-[50%] md:w-[50%] lg:w-[30%]">
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
  </div>
</template>
