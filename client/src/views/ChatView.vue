<script setup>
import { ref, computed } from 'vue'

const conversations = ref([
  {
    id: 1,
    name: 'John Doe',
    initials: 'JD',
    status: 'Online',
    lastMessage: "Hey, what's the update?",
    time: '2m',
    online: true,
    unread: 2,
    messages: [
      {
        id: 1,
        sender: 'John Doe',
        content: "Hey! How's the project going?",
        time: '10:32 AM',
        own: false,
      },
      {
        id: 2,
        sender: 'You',
        content: "It's going well. I'm working on the chat feature now.",
        time: '10:34 AM',
        own: true,
      },
      {
        id: 3,
        sender: 'John Doe',
        content: "Nice 🔥 Let me know when it's ready.",
        time: '10:35 AM',
        own: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Sarah Miller',
    initials: 'SM',
    status: 'Online',
    lastMessage: 'The design looks great!',
    time: '15m',
    online: true,
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'Sarah Miller',
        content: 'I finished the dashboard design.',
        time: '10:10 AM',
        own: false,
      },
      {
        id: 2,
        sender: 'You',
        content: 'The design looks great!',
        time: '10:12 AM',
        own: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Mike Chen',
    initials: 'MC',
    status: 'Offline',
    lastMessage: 'I pushed the API changes.',
    time: '1h',
    online: false,
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'Mike Chen',
        content: 'I pushed the API changes.',
        time: '9:20 AM',
        own: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Dev Team',
    initials: 'DT',
    status: '5 members',
    lastMessage: 'Meeting starts at 2 PM.',
    time: '2h',
    online: true,
    unread: 5,
    messages: [
      {
        id: 1,
        sender: 'Sarah Miller',
        content: 'Meeting starts at 2 PM.',
        time: '8:30 AM',
        own: false,
      },
      {
        id: 2,
        sender: 'You',
        content: 'Got it 👍',
        time: '8:32 AM',
        own: true,
      },
    ],
  },
])

const activeConversation = ref(conversations.value[0])
const searchQuery = ref('')
const messageText = ref('')

const filteredConversations = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  if (!query) {
    return conversations.value
  }

  return conversations.value.filter((conversation) =>
    conversation.name.toLowerCase().includes(query),
  )
})

const selectConversation = (conversation) => {
  activeConversation.value = conversation
  conversation.unread = 0
}

const sendMessage = () => {
  const content = messageText.value.trim()

  if (!content) return

  activeConversation.value.messages.push({
    id: Date.now(),
    sender: 'You',
    content,
    time: 'Just now',
    own: true,
  })

  activeConversation.value.lastMessage = content
  activeConversation.value.time = 'Just now'

  messageText.value = ''
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="flex h-full min-h-[calc(100vh-73px)] overflow-hidden bg-white">
    <!-- Chat Sidebar -->
    <aside class="flex w-80 flex-col border-r border-gray-200 bg-white">
      <!-- Sidebar Header -->
      <div class="border-b border-gray-200 p-5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Chats</h1>

            <p class="mt-1 text-sm text-gray-500">Stay connected with your team</p>
          </div>

          <button
            class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
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
        <div class="relative mt-5">
          <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
            />
          </svg>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <!-- Conversation List -->
      <div class="flex-1 overflow-y-auto p-2">
        <div
          v-if="filteredConversations.length === 0"
          class="px-4 py-10 text-center text-sm text-gray-500"
        >
          No conversations found.
        </div>

        <button
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          @click="selectConversation(conversation)"
          :class="[
            'mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition',
            activeConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-50',
          ]"
        >
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700"
            >
              {{ conversation.initials }}
            </div>

            <span
              v-if="conversation.online"
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
            ></span>
          </div>

          <!-- Conversation Info -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p class="truncate text-sm font-semibold text-gray-900">
                {{ conversation.name }}
              </p>

              <span class="flex-shrink-0 text-xs text-gray-400">
                {{ conversation.time }}
              </span>
            </div>

            <div class="mt-1 flex items-center justify-between gap-2">
              <p class="truncate text-xs text-gray-500">
                {{ conversation.lastMessage }}
              </p>

              <span
                v-if="conversation.unread"
                class="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-semibold text-white"
              >
                {{ conversation.unread }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- Chat Area -->
    <main class="flex min-w-0 flex-1 flex-col bg-white">
      <!-- Chat Header -->
      <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700"
            >
              {{ activeConversation.initials }}
            </div>

            <span
              v-if="activeConversation.online"
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
            ></span>
          </div>

          <div>
            <h2 class="font-semibold text-gray-900">
              {{ activeConversation.name }}
            </h2>

            <p class="text-xs text-gray-500">
              {{ activeConversation.status }}
            </p>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-1">
          <button
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            title="Search in conversation"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>
          </button>

          <button
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            title="More options"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 12h.01M12 12h.01M18 12h.01"
              />
            </svg>
          </button>
        </div>
      </header>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto bg-gray-50/50 px-6 py-6">
        <div class="mx-auto flex max-w-4xl flex-col gap-5">
          <!-- Date Divider -->
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-gray-200"></div>

            <span class="text-xs font-medium text-gray-400"> Today </span>

            <div class="h-px flex-1 bg-gray-200"></div>
          </div>

          <!-- Messages -->
          <div
            v-for="message in activeConversation.messages"
            :key="message.id"
            :class="['flex', message.own ? 'justify-end' : 'justify-start']"
          >
            <div :class="['flex max-w-[70%] gap-2', message.own ? 'flex-row-reverse' : 'flex-row']">
              <!-- Avatar -->
              <div
                v-if="!message.own"
                class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700"
              >
                {{ activeConversation.initials }}
              </div>

              <!-- Message -->
              <div>
                <div
                  :class="[
                    'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    message.own
                      ? 'rounded-br-md bg-blue-600 text-white'
                      : 'rounded-bl-md bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ message.content }}
                </div>

                <p
                  :class="[
                    'mt-1 text-[11px] text-gray-400',
                    message.own ? 'text-right' : 'text-left',
                  ]"
                >
                  {{ message.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="border-t border-gray-200 bg-white p-4">
        <div class="mx-auto max-w-4xl">
          <!-- Attachments / Tools -->
          <div class="mb-3 flex items-center gap-1">
            <button
              class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
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
              class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              title="Add emoji"
            >
              <span class="text-lg">😊</span>
            </button>
          </div>

          <!-- Input -->
          <div
            class="flex items-end gap-3 rounded-xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
          >
            <textarea
              v-model="messageText"
              @keydown="handleKeydown"
              rows="1"
              placeholder="Type a message..."
              class="max-h-32 min-h-[42px] flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-0"
            ></textarea>

            <button
              @click="sendMessage"
              :disabled="!messageText.trim()"
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              title="Send message"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m22 2-7 20-4-9-9-4Z"
                />

                <path
                  d="M22 2 11 13"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <p class="mt-2 text-[11px] text-gray-400">
            Press Enter to send • Shift + Enter for a new line
          </p>
        </div>
      </div>
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
