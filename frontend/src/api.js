import axios from 'axios';
const api = axios.create(
  { baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
  withCredentials: true });
api.interceptors.response.use(r => r, error => {
  const message = error.response?.data?.message || error.message || 'Request failed';
  return Promise.reject(new Error(message));
});
export default api;
