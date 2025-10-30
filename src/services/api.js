
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data || err.message
    console.error('API error:', msg)
    return Promise.reject(err)
  }
)

export default api
