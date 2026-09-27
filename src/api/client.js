import axios from 'axios';
import {
  clearAuthToken,
  getStoredAuth,
  isTokenValid,
} from '../utils/token';

const api = axios.create({
  baseURL: 'https://gateway.scan-interfax.ru/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 60000,
});

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
};

const resetAuthorization = () => {
  clearAuthToken();
  unauthorizedHandler?.();
};

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();

  if (isTokenValid(auth)) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  } else if (auth.accessToken || auth.expire) {
    resetAuthorization();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      resetAuthorization();
    }

    return Promise.reject(error);
  }
);

export default api;
