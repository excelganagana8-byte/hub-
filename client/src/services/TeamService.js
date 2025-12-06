import Api from './Api'
export default {
  fetchTeams() {
    return Api().get('/teams')
  },
}
