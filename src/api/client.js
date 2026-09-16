import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gateway.scan-interfax.ru/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const expire = localStorage.getItem('expire');
  const tokenIsActual =
    token &&
    expire &&
    new Date(expire).getTime() > Date.now();

  if (tokenIsActual) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token || expire) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expire');
  }

  return config;
});

export default api;
