import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiLogin, verifyAdminSession } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('nexios_admin_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexios_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const existingToken = localStorage.getItem('nexios_admin_token');
      if (existingToken) {
        try {
          const res = await verifyAdminSession();
          if (res.success && res.user) {
            setUser(res.user);
          }
        } catch {
          // Token invalid
          localStorage.removeItem('nexios_admin_token');
          localStorage.removeItem('nexios_admin_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    if (data.success && data.token) {
      localStorage.setItem('nexios_admin_token', data.token);
      localStorage.setItem('nexios_admin_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('nexios_admin_token');
    localStorage.removeItem('nexios_admin_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
