import api from './client';

export const loginRequest = (login, password) =>
  api.post('/account/login', { login, password });

export const getAccountInfo = () => api.get('/account/info');

export const getHistograms = (payload) =>
  api.post('/objectsearch/histograms', payload);

export const searchObjects = (payload) => api.post('/objectsearch', payload);

export const getDocuments = (ids) => api.post('/documents', { ids });
