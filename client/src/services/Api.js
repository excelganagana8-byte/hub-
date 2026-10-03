import axios from 'axios'

export default () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  })

  // Add JWT to every request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  // Refresh expired JWT automatically
  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config

      // JWT expired
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/refresh')
      ) {
        originalRequest._retry = true

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/refresh-token`,
            {},
            {
              withCredentials: true,
            },
          )

          const newToken = response.data.token

          // Save new JWT
          localStorage.setItem('token', newToken)

          // Put new JWT on the failed request
          originalRequest.headers.Authorization = `Bearer ${newToken}`

          // Try the original request again
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh token also failed/expired
          localStorage.removeItem('token')
          localStorage.removeItem('user')

          window.location.href = '/login'

          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )

  return api
}
