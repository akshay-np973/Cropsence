import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
