import Api from './Api'

export default {
  register(credentials) {
    return Api().post('/signup', credentials)
  },

  signin(credentials) {
    return Api().post('/signin', credentials)
  },

  logout() {
    return Api().post('/logout')
  },
}
