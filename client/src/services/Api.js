import axios from 'axios'

export default () => {
  const api = axios.create({
    baseURL: 'https://collab-x-api.onrender.com/api',
  })

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  return api
}
