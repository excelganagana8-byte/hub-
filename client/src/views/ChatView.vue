<script setup>
import { io } from 'socket.io-client'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import Api from '@/services/Api'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

const searchQuery = ref('')
const messageText = ref('')
const users = ref([])
const conversations = ref([])
const activeConversation = ref(null)
const messagesContainer = ref(null)
const textarea = ref(null)

// Track scroll state + incoming messages while reading history
const hasNewMessages = ref(false)
let pendingUnseen = 0

const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''))

/* -----------------------------
   Time formatting helper
------------------------------ */
const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* -----------------------------
   Scroll helpers
------------------------------ */
const isNearBottom = () => {
  const el = messagesContainer.value
  if (!el) return true
  return el.scrollHeight - el.scrollTop - el.clientHeight < 120
}

const scrollToBottom = async (force = false) => {
  await nextTick()

  const el = messagesContainer.value
  if (!el) return

  if (force || isNearBottom()) {
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    hasNewMessages.value = false
    pendingUnseen = 0
  } else {
    pendingUnseen += 1
    hasNewMessages.value = true
  }
}

const onMessagesScroll = () => {
  if (hasNewMessages.value && isNearBottom()) {
    hasNewMessages.value = false
    pendingUnseen = 0
  }
}

/* -----------------------------
   Socket handlers
------------------------------ */
const handleConnect = () => {
  if (auth.user?._id) {
    socket.emit('join', auth.user._id)
  }
}

const handleConnectError = (error) => {
  console.error('Socket connection error:', error)
}

const handleNewMessage = async (message) => {
  const conversation = conversations.value.find((item) => item.id === message.sender._id)

  if (!conversation) return

  // Avoid duplicate messages
  if (conversation.messages.some((m) => m._id === message._id)) {
    return
  }

  conversation.messages.push(message)
  conversation.lastMessage = message.content
  conversation.time = formatTime(message.createdAt)
  conversation.timestamp = new Date(message.createdAt).getTime() // Updates sorting timestamp

  if (activeConversation.value?.id === conversation.id) {
    activeConversation.value = conversation
    conversation.unread = 0
    await scrollToBottom()
  } else {
    conversation.unread += 1
  }
}

/* -----------------------------
   Lifecycle
------------------------------ */
onMounted(() => {
  fetchUsers()

  socket.on('connect', handleConnect)
  socket.on('connect_error', handleConnectError)
  socket.on('newMessage', handleNewMessage)

  if (socket.connected) {
    handleConnect()
  }
})

onUnmounted(() => {
  socket.off('connect', handleConnect)
  socket.off('connect_error', handleConnectError)
  socket.off('newMessage', handleNewMessage)
})

/* -----------------------------
   Fetch users
------------------------------ */
const fetchUsers = async () => {
  try {
    const response = await Api().get('/users')

    users.value = response.data

    conversations.value = users.value.map((user) => {
      const latestMessage = user.latestMessage

      return {
        id: user._id,
        name: user.username,
        email: user.email,

        initials: user.username
          .split(' ')
          .map((word) => word[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),

        status: 'Available',
        online: false,
        unread: 0,

        lastMessage: latestMessage?.content || '',
        time: latestMessage ? formatTime(latestMessage.createdAt) : '',

        timestamp: latestMessage ? new Date(latestMessage.createdAt).getTime() : 0,

        messages: [],
      }
    })
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}
/* -----------------------------
   Sort & Search conversations
------------------------------ */
const filteredConversations = computed(() => {
  let list = conversations.value

  // 1. Filter by search query
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    list = list.filter((conversation) => conversation.name.toLowerCase().includes(query))
  }

  // 2. Return a reactively sorted array (newest chats at the top)
  return [...list].sort((a, b) => b.timestamp - a.timestamp)
})

/* -----------------------------
   Grouping logic
------------------------------ */
const isGroupedWithPrevious = (index, messages) => {
  if (index === 0) return false
  const current = messages[index]
  const previous = messages[index - 1]
  return current.sender._id === previous.sender._id
}

/* -----------------------------
   Select conversation
------------------------------ */
const selectConversation = async (conversation) => {
  activeConversation.value = conversation
  conversation.unread = 0
  hasNewMessages.value = false

  try {
    const response = await Api().get(`/messages/${conversation.id}`)
    conversation.messages = response.data

    if (conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1]
      conversation.lastMessage = lastMessage.content
      conversation.time = formatTime(lastMessage.createdAt)
      conversation.timestamp = new Date(lastMessage.createdAt).getTime() // Updates sorting timestamp
    }

    await scrollToBottom(true)
  } catch (error) {
    console.error('Failed to load conversation:', error)
  }
}

/* -----------------------------
   Mobile: back to the list
------------------------------ */
const backToConversationList = () => {
  activeConversation.value = null
}

/* -----------------------------
   Send message
------------------------------ */
const sendMessage = async () => {
  const content = messageText.value.trim()
  if (!content || !activeConversation.value) return

  try {
    const response = await Api().post('/messages', {
      receiver: activeConversation.value.id,
      content,
    })

    const newMessage = response.data

    activeConversation.value.messages.push(newMessage)
    activeConversation.value.lastMessage = content
    activeConversation.value.time = formatTime(newMessage.createdAt)
    activeConversation.value.timestamp = new Date(newMessage.createdAt).getTime() // Updates sorting timestamp

    messageText.value = ''
    autoGrowTextarea()

    await scrollToBottom(true)
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

/* -----------------------------
   Keyboard & Input
------------------------------ */
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const autoGrowTextarea = () => {
  const el = textarea.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 132)}px`
}
</script>

<template>
  <div class="flex h-[calc(100vh-73px)] max-h-[calc(100vh-73px)] overflow-hidden bg-white">
    <!-- Chat Sidebar -->
    <aside
      :class="[
        'flex w-full flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200 md:w-80 md:flex',
        activeConversation ? 'hidden' : 'flex',
      ]"
    >
      <!-- Sidebar Header -->
      <div class="border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold tracking-tight text-gray-900">Chats</h1>

          <button
            class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            title="New chat"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v14m-7-7h14"
              />
            </svg>
          </button>
        </div>

        <!-- Search -->
        <div class="relative mt-4">
          <svg
            class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1 0 15"
            />
          </svg>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <!-- Conversation List -->
      <div class="flex-1 overflow-y-auto overscroll-contain p-2">
        <div
          v-if="filteredConversations.length === 0"
          class="flex h-40 flex-col items-center justify-center px-4 text-center text-sm text-gray-500"
        >
          <p>No conversations found</p>
        </div>

        <button
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          @click="selectConversation(conversation)"
          :class="[
            'group mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition duration-150',
            activeConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-50',
          ]"
        >
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-sm font-semibold text-gray-700"
            >
              {{ conversation.initials }}
            </div>

            <span
              v-if="conversation.online"
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
            ></span>
          </div>

          <!-- Conversation Info -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p class="truncate text-sm font-semibold text-gray-900">
                {{ conversation.name }}
              </p>

              <span class="flex-shrink-0 text-[11px] font-medium text-gray-400">
                {{ conversation.time }}
              </span>
            </div>

            <div class="mt-1 flex items-center justify-between gap-2">
              <p class="truncate text-xs text-gray-500">
                {{ conversation.lastMessage || 'No messages yet' }}
              </p>

              <span
                v-if="conversation.unread"
                class="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white"
              >
                {{ conversation.unread }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- Chat Area -->
    <main
      :class="[
        'relative flex min-w-0 flex-1 flex-col bg-gray-50/60',
        activeConversation ? 'flex' : 'hidden md:flex',
      ]"
    >
      <!-- Empty State -->
      <div
        v-if="!activeConversation"
        class="flex flex-1 flex-col items-center justify-center p-6 text-center"
      >
        <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
          <svg
            class="h-10 w-10 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>

        <h2 class="mt-5 text-lg font-semibold text-gray-900">
          Select a conversation to start chatting
        </h2>
        <p class="mt-1 max-w-sm text-sm text-gray-500">
          Pick someone from the list, and your messages will appear here in real time.
        </p>
      </div>

      <!-- Active Chat -->
      <template v-else>
        <!-- Chat Header -->
        <header
          class="z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6"
        >
          <div class="flex min-w-0 items-center gap-3">
            <!-- Mobile back button -->
            <button
              @click="backToConversationList"
              class="-ml-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
              title="Back to conversations"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div class="relative flex-shrink-0">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-sm font-semibold text-blue-800"
              >
                {{ activeConversation.initials }}
              </div>

              <span
                v-if="activeConversation.online"
                class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
              ></span>
            </div>

            <div class="min-w-0">
              <h2 class="truncate font-semibold text-gray-900">
                {{ activeConversation.name }}
              </h2>

              <p class="text-xs text-gray-500">
                {{ activeConversation.online ? 'Online' : activeConversation.status }}
              </p>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-1">
            <button
              class="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              title="Search in conversation"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1 0 15"
                />
              </svg>
            </button>

            <button
              class="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              title="More options"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5h.01M12 12h.01M12 19h.01"
                />
              </svg>
            </button>
          </div>
        </header>

        <!-- Messages Stream -->
        <div
          ref="messagesContainer"
          @scroll="onMessagesScroll"
          class="relative flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6 md:py-6"
        >
          <div class="mx-auto flex max-w-4xl flex-col">
            <!-- Date Divider -->
            <div v-if="activeConversation.messages.length" class="mb-4 flex items-center gap-4">
              <div class="h-px flex-1 bg-gray-200"></div>

              <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                >Today</span
              >

              <div class="h-px flex-1 bg-gray-200"></div>
            </div>

            <!-- Empty conversation -->
            <div
              v-if="activeConversation.messages.length === 0"
              class="flex flex-1 items-center justify-center py-24 text-center"
            >
              <div>
                <p class="text-sm font-medium text-gray-700">No messages yet</p>
                <p class="mt-1 text-xs text-gray-400">Send a message to start the conversation.</p>
              </div>
            </div>

            <!-- Messages -->
            <div
              v-for="(message, index) in activeConversation.messages"
              :key="message._id"
              :class="[
                'flex',
                message.sender._id === activeConversation.id ? 'justify-start' : 'justify-end',
                isGroupedWithPrevious(index, activeConversation.messages) ? 'mt-0.5' : 'mt-3',
              ]"
            >
              <div
                :class="[
                  'flex max-w-[80%] gap-2 md:max-w-[70%]',
                  message.sender._id === activeConversation.id ? 'flex-row' : 'flex-row-reverse',
                ]"
              >
                <!-- Avatar -->
                <div class="w-8 flex-shrink-0">
                  <div
                    v-if="
                      message.sender._id === activeConversation.id &&
                      !isGroupedWithPrevious(index, activeConversation.messages)
                    "
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700"
                  >
                    {{ activeConversation.initials }}
                  </div>
                </div>

                <!-- Bubble -->
                <div
                  :class="[
                    'relative px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                    message.sender._id === activeConversation.id
                      ? 'rounded-2xl rounded-bl-md bg-white text-gray-800 ring-1 ring-gray-200/80'
                      : 'rounded-2xl rounded-br-md bg-blue-600 text-white',
                  ]"
                >
                  <p class="whitespace-pre-wrap break-words pr-14">
                    {{ message.content }}
                  </p>

                  <span
                    :class="[
                      'absolute bottom-1.5 right-3 text-[10px]',
                      message.sender._id === activeConversation.id
                        ? 'text-gray-400'
                        : 'text-blue-200',
                    ]"
                  >
                    {{ formatTime(message.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- "New messages" indicator -->
        <button
          v-if="hasNewMessages"
          @click="scrollToBottom(true)"
          class="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-gray-900"
        >
          New messages ↓
        </button>

        <!-- Message Input -->
        <div class="flex-shrink-0 border-t border-gray-200 bg-white p-3 md:p-4">
          <div class="mx-auto max-w-4xl">
            <div
              class="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100"
            >
              <button
                type="button"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200/70 hover:text-gray-700"
                title="Attach file"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                  />
                </svg>
              </button>

              <button
                type="button"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200/70 hover:text-gray-700"
                title="Add emoji"
              >
                <span class="text-lg">😊</span>
              </button>

              <textarea
                ref="textarea"
                v-model="messageText"
                @keydown="handleKeydown"
                @input="autoGrowTextarea"
                rows="1"
                placeholder="Type a message..."
                class="max-h-32 min-h-[36px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm leading-relaxed text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
              ></textarea>

              <button
                @click="sendMessage"
                :disabled="!messageText.trim()"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                title="Send message"
              >
                <svg
                  class="h-5 w-5 translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m22 2-7 20-4-9-9-4Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M22 2 11 13"
                  />
                </svg>
              </button>
            </div>

            <p class="mt-2 text-[11px] text-gray-400">
              Press Enter to send • Shift + Enter for a new line
            </p>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
/* Chat scrollbar */
aside > div::-webkit-scrollbar,
main > div::-webkit-scrollbar {
  width: 6px;
}

aside > div::-webkit-scrollbar-track,
main > div::-webkit-scrollbar-track {
  background: transparent;
}

aside > div::-webkit-scrollbar-thumb,
main > div::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

aside > div::-webkit-scrollbar-thumb:hover,
main > div::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
