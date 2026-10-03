import Api from './Api'

export default {
  fetchRecentActivities(limit = 20) {
    return Api().get('/activities', {
      params: { limit },
    })
  },

  createActivity(activityData) {
    return Api().post('/activities', activityData)
  },
}
