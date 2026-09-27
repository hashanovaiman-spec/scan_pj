const ACCESS_TOKEN_KEY = 'accessToken';
const EXPIRE_KEY = 'expire';

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

export const getStoredAuth = () => {
  const storage = getStorage();

  return {
    accessToken: storage?.getItem(ACCESS_TOKEN_KEY) || '',
    expire: storage?.getItem(EXPIRE_KEY) || '',
  };
};

export const isTokenValid = (auth = getStoredAuth()) => {
  if (!auth.accessToken || !auth.expire) return false;

  const expiresAt = Date.parse(auth.expire);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
};

export const getTokenExpiration = () => {
  const { expire } = getStoredAuth();
  if (!expire) return 0;

  const expiresAt = Date.parse(expire);
  return Number.isFinite(expiresAt) ? expiresAt : 0;
};

export const saveAuthToken = (accessToken, expire) => {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(EXPIRE_KEY, expire);
};

export const clearAuthToken = () => {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(EXPIRE_KEY);
};
