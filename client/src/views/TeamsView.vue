<script setup>
import { ref, onMounted } from 'vue'
import TeamService from '@/services/TeamService'

const teams = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    teams.value = await TeamService.fetchTeams()
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load teams'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1>Teams</h1>

    <p v-if="loading">Loading teams...</p>

    <p v-else-if="error">{{ error }}</p>

    <div v-else-if="teams.length">
      <div v-for="team in teams" :key="team._id">
        <h2>{{ team.name }}</h2>

        <RouterLink :to="`/teams/${team._id}`"> Open Team </RouterLink>
      </div>
    </div>

    <p v-else>You don't have any teams yet.</p>
  </div>
</template>
