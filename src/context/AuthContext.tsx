import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  quickLogin: (role: 'admin' | 'user') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fitzone_token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('fitzone_token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }
    try {
      const res = await apiService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('fitzone_token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      localStorage.removeItem('fitzone_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiService.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem('fitzone_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone?: string; password: string }) => {
    setLoading(true);
    try {
      const res = await apiService.register(data);
      if (res.success && res.token) {
        localStorage.setItem('fitzone_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fitzone_token');
    setUser(null);
    setToken(null);
  };

  const quickLogin = async (role: 'admin' | 'user') => {
    if (role === 'admin') {
      await login('admin@fitzone.com', 'admin123');
    } else {
      await login('member@fitzone.com', 'member123');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        loading,
        login,
        register,
        logout,
        refreshUser,
        quickLogin,
      }}
    >
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
