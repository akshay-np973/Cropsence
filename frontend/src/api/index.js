import axios from 'axios'

// In production (Vercel), set VITE_API_URL to your Render backend URL
// In dev, Vite proxies /api → localhost:8000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

export const runPrediction = (data) => api.post('/predict', data).then((r) => r.data)
export const assistForm = (description) => api.post('/predict/assist', { description }).then((r) => r.data)
export const getHistory = (search = '') => api.get('/history', { params: search ? { search } : {} }).then((r) => r.data)
export const getPrediction = (id) => api.get(`/history/${id}`).then((r) => r.data)
export const deletePrediction = (id) => api.delete(`/history/${id}`)
export const getWeather = (city) => api.get('/weather', { params: { city } }).then((r) => r.data)

export default api
