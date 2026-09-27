import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { setUnauthorizedHandler } from '../api/client';
import { getAccountInfo, loginRequest } from '../api/scanApi';
import { clearSearch } from '../store/searchSlice';
import { clearLastSearch } from '../utils/searchStorage';
import {
  clearAuthToken,
  getTokenExpiration,
  isTokenValid,
  saveAuthToken,
} from '../utils/token';

const AuthContext = createContext(null);

const getInitialAuthState = () => {
  if (isTokenValid()) return true;

  clearAuthToken();
  return false;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState);
  const [accountInfo, setAccountInfo] = useState(null);
  const [accountLoading, setAccountLoading] = useState(false);

  const logout = useCallback(() => {
    clearAuthToken();
    clearLastSearch();
    dispatch(clearSearch());
    setIsAuthenticated(false);
    setAccountInfo(null);
    setAccountLoading(false);
  }, [dispatch]);

  const login = useCallback(async (loginValue, password) => {
    const { data } = await loginRequest(loginValue, password);

    saveAuthToken(data.accessToken, data.expire);
    setIsAuthenticated(true);

    return data;
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const timeLeft = getTokenExpiration() - Date.now();

    if (timeLeft <= 0) {
      logout();
      return undefined;
    }

    const timeoutId = window.setTimeout(logout, timeLeft);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, logout]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let active = true;
    setAccountLoading(true);

    getAccountInfo()
      .then(({ data }) => {
        if (active) {
          setAccountInfo(data.eventFiltersInfo || null);
        }
      })
      .catch(() => {
        // 401 обрабатывается централизованно response interceptor'ом.
      })
      .finally(() => {
        if (active) {
          setAccountLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      accountInfo,
      accountLoading,
      login,
      logout,
    }),
    [isAuthenticated, accountInfo, accountLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
