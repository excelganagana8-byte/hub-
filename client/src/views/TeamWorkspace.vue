<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Settings, UserPlus, MessageSquare, Folder, CheckSquare } from '@lucide/vue'
import TeamService from '@/services/TeamService'

const route = useRoute()
const router = useRouter()

const team = ref(null)
const loading = ref(true)
const error = ref('')

const fetchTeam = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await TeamService.getTeamById(route.params.teamId)

    team.value = response.data.team
  } catch (err) {
    console.error('Failed to fetch team:', err)

    error.value = err.response?.data?.message || 'Failed to load team.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/dashboard')
}

onMounted(fetchTeam)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft class="w-4 h-4" aria-hidden="true" />
            <span>Back</span>
          </button>

          <div v-if="team">
            <h1 class="text-xl font-semibold text-gray-900">
              {{ team.name }}
            </h1>

            <p class="text-sm text-gray-500">
              {{ team.description || 'No description' }}
            </p>
          </div>
        </div>

        <button
          class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Settings class="w-4 h-4" aria-hidden="true" />
          <span>Settings</span>
        </button>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[70vh]">
      <p class="text-gray-500">Loading team...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[70vh]">
      <p class="text-red-600 mb-4">
        {{ error }}
      </p>

      <button @click="goBack" class="px-4 py-2 bg-gray-900 text-white rounded-lg">
        Back to Dashboard
      </button>
    </div>

    <!-- Workspace -->
    <main v-else-if="team" class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <aside class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="font-semibold text-gray-900 mb-4">Team Members</h2>

          <div class="space-y-3">
            <div
              v-for="member in team.members"
              :key="member.user._id"
              class="flex items-center gap-3"
            >
              <div
                class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium"
              >
                {{ member.user.username?.charAt(0).toUpperCase() }}
              </div>

              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ member.user.username }}
                </p>

                <p class="text-xs text-gray-500 capitalize">
                  {{ member.role }}
                </p>
              </div>
            </div>
          </div>

          <button
            class="w-full mt-5 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPlus class="w-4 h-4" aria-hidden="true" />
            <span>Invite Member</span>
          </button>
        </aside>

        <!-- Main Workspace -->
        <section class="lg:col-span-3">
          <div class="bg-white rounded-xl border border-gray-200 min-h-[500px] p-6">
            <h2 class="text-2xl font-semibold text-gray-900">Welcome to {{ team.name }}</h2>

            <p class="text-gray-500 mt-2">This is your team workspace.</p>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <MessageSquare class="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 class="font-medium text-gray-900">Chat</h3>
                <p class="text-sm text-gray-500 mt-1">Communicate with your team.</p>
              </div>

              <div class="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Folder class="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 class="font-medium text-gray-900">Files</h3>
                <p class="text-sm text-gray-500 mt-1">Share and manage team files.</p>
              </div>

              <div class="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckSquare class="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 class="font-medium text-gray-900">Tasks</h3>
                <p class="text-sm text-gray-500 mt-1">Manage your team's tasks.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
