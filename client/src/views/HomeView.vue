```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import TeamService from '@/services/TeamService'

const auth = useAuthStore()
const router = useRouter()

const user = ref(null)
const teams = ref([])
const activeTeam = ref(null)

const recentActivity = ref([])
const upcomingMeetings = ref([])
const quickAccessItems = ref([])

const activeNav = ref('home')
const isSidebarCollapsed = ref(false)
const loadingTeams = ref(false)

// Create Team Modal
const showCreateTeamModal = ref(false)
const teamName = ref('')
const teamDescription = ref('')
const isCreatingTeam = ref(false)
const teamError = ref('')

// Fetch dashboard data
onMounted(async () => {
  user.value = auth.user

  await fetchTeams()

  // Temporary data until Activity API is created
  recentActivity.value = [
    {
      id: 1,
      type: 'message',
      user: 'Alex Johnson',
      content: 'Posted in #general',
      time: '10 min ago',
      team: 'Dev Team',
    },
    {
      id: 2,
      type: 'file',
      user: 'Sarah Miller',
      content: 'Uploaded project-plan.pdf',
      time: '1 hour ago',
      team: 'Design Team',
    },
    {
      id: 3,
      type: 'task',
      user: 'Mike Chen',
      content: 'Completed task: Update API docs',
      time: '2 hours ago',
      team: 'Dev Team',
    },
  ]

  // Temporary data until Meeting API is created
  upcomingMeetings.value = [
    {
      id: 1,
      title: 'Daily Standup',
      time: '9:00 AM',
      team: 'Dev Team',
      duration: '15 min',
    },
    {
      id: 2,
      title: 'Product Review',
      time: '2:00 PM',
      team: 'All Teams',
      duration: '1 hour',
    },
  ]

  // Quick access
  quickAccessItems.value = [
    {
      id: 1,
      title: 'New Chat',
      icon: '💬',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 2,
      title: 'Schedule Meeting',
      icon: '📅',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      id: 3,
      title: 'Upload File',
      icon: '📎',
      color: 'bg-green-100 text-green-700',
    },
    {
      id: 4,
      title: 'Create Task',
      icon: '✅',
      color: 'bg-yellow-100 text-yellow-700',
    },
  ]
})

// Fetch user's teams
const fetchTeams = async () => {
  loadingTeams.value = true

  try {
    const response = await TeamService.fetchTeams()

    teams.value = response.data.teams || []

    // Automatically select first team
    if (teams.value.length > 0) {
      activeTeam.value = teams.value[0]
    }
  } catch (error) {
    console.error('Failed to fetch teams:', error)
  } finally {
    loadingTeams.value = false
  }
}

// Navigation
const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: '👥',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: '💬',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: '📅',
  },
  {
    id: 'files',
    label: 'Files',
    icon: '📁',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: '✅',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📊',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
  },
]

// Change navigation
const setActiveNav = (navId) => {
  activeNav.value = navId
}

// Select team
const selectTeam = (team) => {
  activeTeam.value = team
}

// Open team workspace
const openTeam = (team) => {
  if (!team?._id) {
    console.error('Team ID is missing')
    return
  }

  router.push(`/teams/${team._id}`)
}

// Create New
const createNew = (type) => {
  if (type === 'team') {
    openCreateTeamModal()
    return
  }

  console.log(`Creating new ${type}`)
}

// Open Create Team Modal
const openCreateTeamModal = () => {
  teamName.value = ''
  teamDescription.value = ''
  teamError.value = ''

  showCreateTeamModal.value = true
}

// Close Create Team Modal
const closeCreateTeamModal = () => {
  if (isCreatingTeam.value) return

  showCreateTeamModal.value = false
  teamName.value = ''
  teamDescription.value = ''
  teamError.value = ''
}

// Create Team
const createTeam = async () => {
  teamError.value = ''

  if (!teamName.value.trim()) {
    teamError.value = 'Team name is required'
    return
  }

  if (teamName.value.trim().length < 2) {
    teamError.value = 'Team name must be at least 2 characters'
    return
  }

  isCreatingTeam.value = true

  try {
    const response = await TeamService.createTeam({
      name: teamName.value.trim(),
      description: teamDescription.value.trim(),
    })

    const newTeam = response.data.team

    if (!newTeam) {
      throw new Error('No team returned from server')
    }

    // Add new team to dashboard
    teams.value.push(newTeam)

    // Make new team active
    activeTeam.value = newTeam

    // Close modal
    showCreateTeamModal.value = false
    teamName.value = ''
    teamDescription.value = ''

    console.log('Team created successfully:', newTeam)
  } catch (error) {
    console.error('Failed to create team:', error)

    teamError.value = error.response?.data?.message || 'Failed to create team. Please try again.'
  } finally {
    isCreatingTeam.value = false
  }
}

// Join meeting
const joinMeeting = () => {
  alert('Joining meeting...')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'hidden lg:flex flex-col border-r border-gray-200 bg-white transition-all duration-300',
        isSidebarCollapsed ? 'w-20' : 'w-64',
      ]"
    >
      <!-- Logo -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3" :class="{ 'justify-center': isSidebarCollapsed }">
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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

          <h1 v-if="!isSidebarCollapsed" class="text-xl font-semibold text-gray-900">CollabX</h1>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="setActiveNav(item.id)"
          :class="[
            'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
            activeNav === item.id
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-50',
          ]"
        >
          <span class="text-xl">
            {{ item.icon }}
          </span>

          <span v-if="!isSidebarCollapsed" class="font-medium">
            {{ item.label }}
          </span>
        </button>
      </nav>

      <!-- User -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div v-if="!isSidebarCollapsed" class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium"
            >
              {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>

            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ user?.username || 'User' }}
              </p>

              <p class="text-xs text-gray-500">Online</p>
            </div>
          </div>

          <div
            v-else
            class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium mx-auto"
          >
            {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
          </div>

          <button
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              :class="[
                'w-5 h-5 text-gray-500 transform transition-transform',
                isSidebarCollapsed ? 'rotate-180' : '',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Header -->
      <header class="hidden lg:block bg-white border-b border-gray-200">
        <div class="px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 max-w-2xl">
              <div class="relative">
                <input
                  type="search"
                  placeholder="Search teams, messages, or files..."
                  class="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <svg
                  class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div class="flex items-center space-x-4 ml-6">
              <button
                class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>

                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                @click="createNew('team')"
                class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
              >
                <span>+</span>
                <span>Create New</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-8">
        <!-- Welcome -->
        <div class="mb-8">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, {{ user?.username || 'there' }}! 👋
          </h1>

          <p class="text-gray-600 mt-2">Here's what's happening with your teams today.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <!-- LEFT -->
          <div class="lg:col-span-2 space-y-6 lg:space-y-8">
            <!-- Teams -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Your Teams</h2>

                <div class="flex space-x-2">
                  <button
                    class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    View All
                  </button>

                  <button
                    @click="createNew('team')"
                    class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    + New Team
                  </button>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="loadingTeams" class="text-center py-10 text-gray-500">
                Loading teams...
              </div>

              <!-- No teams -->
              <div v-else-if="teams.length === 0" class="text-center py-10">
                <p class="text-gray-500 mb-4">You haven't joined any teams yet.</p>

                <button
                  @click="createNew('team')"
                  class="px-4 py-2 bg-gray-900 text-white rounded-lg"
                >
                  Create your first team
                </button>
              </div>

              <!-- Teams -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="team in teams"
                  :key="team._id"
                  @click="selectTeam(team)"
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                  :class="{
                    'ring-2 ring-blue-500 border-blue-500': activeTeam?._id === team._id,
                  }"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-center space-x-3">
                      <div
                        :class="[
                          team.color || 'bg-blue-600',
                          'w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold',
                        ]"
                      >
                        {{ team.name?.charAt(0).toUpperCase() }}
                      </div>

                      <div>
                        <h3 class="font-medium text-gray-900">
                          {{ team.name }}
                        </h3>

                        <p class="text-sm text-gray-500">{{ team.members?.length || 0 }} members</p>
                      </div>
                    </div>

                    <div
                      v-if="team.unread"
                      class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {{ team.unread }}
                    </div>
                  </div>

                  <div
                    class="mt-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      @click.stop
                      class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Chat
                    </button>

                    <button
                      @click.stop="openTeam(team)"
                      class="flex-1 px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>

                <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  See all activity
                </button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  class="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div class="flex-shrink-0">
                    <div
                      v-if="activity.type === 'message'"
                      class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                    >
                      💬
                    </div>

                    <div
                      v-else-if="activity.type === 'file'"
                      class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      📎
                    </div>

                    <div
                      v-else-if="activity.type === 'task'"
                      class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center"
                    >
                      ✅
                    </div>

                    <div
                      v-else
                      class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                    >
                      📅
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <p class="text-sm text-gray-900 truncate">
                        <span class="font-medium">
                          {{ activity.user }}
                        </span>

                        {{ activity.content }}
                      </p>

                      <span class="text-xs text-gray-500">
                        {{ activity.time }}
                      </span>
                    </div>

                    <span
                      class="text-xs text-gray-400 mt-1 inline-block px-2 py-1 bg-gray-100 rounded"
                    >
                      {{ activity.team }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="space-y-6 lg:space-y-8">
            <!-- Upcoming -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Upcoming</h2>

                <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all
                </button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="meeting in upcomingMeetings"
                  :key="meeting.id"
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-medium text-gray-900">
                        {{ meeting.title }}
                      </h3>

                      <p class="text-sm text-gray-500 mt-1">
                        {{ meeting.time }} • {{ meeting.duration }}
                      </p>

                      <p class="text-xs text-gray-400 mt-2">
                        {{ meeting.team }}
                      </p>
                    </div>

                    <button
                      @click="joinMeeting"
                      class="px-3 py-1 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Access -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-6">Quick Access</h2>

              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="item in quickAccessItems"
                  :key="item.id"
                  @click="createNew(item.title)"
                  :class="[
                    item.color,
                    'flex flex-col items-center justify-center p-4 rounded-xl hover:scale-[1.02] transition-transform duration-200',
                  ]"
                >
                  <span class="text-2xl mb-2">
                    {{ item.icon }}
                  </span>

                  <span class="text-sm font-medium">
                    {{ item.title }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Active Team -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-lg">Active Team</h3>

                <span class="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {{ activeTeam?.members?.length || 0 }} members
                </span>
              </div>

              <h2 class="text-2xl font-bold mb-2">
                {{ activeTeam?.name || 'No active team' }}
              </h2>

              <p class="text-blue-100 mb-6">{{ activeTeam?.unread || 0 }} unread messages</p>

              <button
                @click="activeTeam && openTeam(activeTeam)"
                :disabled="!activeTeam"
                class="w-full py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Open Workspace
              </button>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="hidden lg:block mt-8">
          <div class="grid grid-cols-4 gap-6">
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 text-sm"> Total Teams </span>

                <span class="text-2xl font-bold text-gray-900">
                  {{ teams.length }}
                </span>
              </div>

              <p class="text-xs text-gray-500 mt-2">Across all workspaces</p>
            </div>

            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 text-sm"> Active Members </span>

                <span class="text-2xl font-bold text-gray-900">
                  {{ teams.reduce((total, team) => total + (team.members?.length || 0), 0) }}
                </span>
              </div>

              <p class="text-xs text-gray-500 mt-2">Across your teams</p>
            </div>

            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 text-sm"> Unread Messages </span>

                <span class="text-2xl font-bold text-gray-900"> 0 </span>
              </div>

              <p class="text-xs text-gray-500 mt-2">Across all chats</p>
            </div>

            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 text-sm"> Storage Used </span>

                <span class="text-2xl font-bold text-gray-900"> 0% </span>
              </div>

              <p class="text-xs text-gray-500 mt-2">0GB used</p>
            </div>
          </div>
        </div>
      </main>

      <!-- Create Team Modal -->
      <div
        v-if="showCreateTeamModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
        @click.self="closeCreateTeamModal"
      >
        <div class="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Create New Team</h2>

              <p class="text-sm text-gray-500 mt-1">Create a team and start collaborating.</p>
            </div>

            <button
              @click="closeCreateTeamModal"
              :disabled="isCreatingTeam"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Error -->
          <div
            v-if="teamError"
            class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
          >
            {{ teamError }}
          </div>

          <!-- Team Name -->
          <div class="mb-4">
            <label for="teamName" class="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>

            <input
              id="teamName"
              v-model="teamName"
              type="text"
              placeholder="e.g. Development Team"
              :disabled="isCreatingTeam"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label for="teamDescription" class="block text-sm font-medium text-gray-700 mb-2">
              Description
              <span class="text-gray-400 font-normal"> (optional) </span>
            </label>

            <textarea
              id="teamDescription"
              v-model="teamDescription"
              rows="4"
              placeholder="What is this team about?"
              :disabled="isCreatingTeam"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button
              @click="closeCreateTeamModal"
              :disabled="isCreatingTeam"
              class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              @click="createTeam"
              :disabled="isCreatingTeam"
              class="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isCreatingTeam"> Creating... </span>

              <span v-else> Create Team </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg z-50"
      >
        <div class="flex justify-around">
          <button
            v-for="item in navItems.slice(0, 4)"
            :key="item.id"
            @click="setActiveNav(item.id)"
            :class="[
              'flex flex-col items-center p-2',
              activeNav === item.id ? 'text-blue-600' : 'text-gray-500',
            ]"
          >
            <span class="text-2xl">
              {{ item.icon }}
            </span>

            <span class="text-xs mt-1">
              {{ item.label }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
```
