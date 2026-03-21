import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const logoutAll = async () => {
    try { await authApi.logoutAll(); } catch {}
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isChild = user?.role === 'child';
  const isGuardian = user?.isGuardian === true;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user, loading, isAdmin, isChild, isGuardian, isAuthenticated,
      login, logout, logoutAll, fetchMe, setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};