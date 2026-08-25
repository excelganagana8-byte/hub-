import Api from './Api'

export default {
  fetchTeams() {
    return Api().get('/teams')
  },

  createTeam(teamData) {
    return Api().post('/teams', teamData)
  },

  getTeamById(teamId) {
    return Api().get(`/teams/${teamId}`)
  },
}
