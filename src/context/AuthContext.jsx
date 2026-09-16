import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAccountInfo, loginRequest } from '../api/scanApi';

const AuthContext = createContext(null);

const tokenIsValid = () => {
  const token = localStorage.getItem('accessToken');
  const expire = localStorage.getItem('expire');
  if (!token || !expire) return false;
  return new Date(expire).getTime() > Date.now();
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(tokenIsValid);
  const [accountInfo, setAccountInfo] = useState(null);
  const [accountLoading, setAccountLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expire');
    setIsAuthenticated(false);
    setAccountInfo(null);
  };

  const login = async (loginValue, password) => {
    const { data } = await loginRequest(loginValue, password);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('expire', data.expire);
    setIsAuthenticated(true);
    return data;
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const expire = localStorage.getItem('expire');
    const expiresAt = expire ? new Date(expire).getTime() : 0;
    const timeLeft = expiresAt - Date.now();

    if (timeLeft <= 0) {
      logout();
      return;
    }

    const timeoutId = window.setTimeout(logout, timeLeft);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!tokenIsValid()) {
      logout();
      return;
    }

    let active = true;
    setAccountLoading(true);
    getAccountInfo()
      .then(({ data }) => {
        if (active) setAccountInfo(data.eventFiltersInfo || null);
      })
      .catch((error) => {
        if (error.response?.status === 401) logout();
      })
      .finally(() => {
        if (active) setAccountLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({ isAuthenticated, accountInfo, accountLoading, login, logout }),
    [isAuthenticated, accountInfo, accountLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
