import axios from 'axios'
import router from '@/router'

const apiClient = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
      if (error.response.data?.message === 'Invalid Token') {
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login')
        }
      }
    } else {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default apiClient
