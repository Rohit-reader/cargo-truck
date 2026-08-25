import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerTrader: (data: any) => Promise<void>;
  registerProvider: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('smartcargo_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (!localStorage.getItem('smartcargo_token')) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Failed to load user', err);
      localStorage.removeItem('smartcargo_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('smartcargo_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerTrader = async (formData: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register-trader', formData);
      if (res.data.success) {
        localStorage.setItem('smartcargo_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerProvider = async (formData: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register-provider', formData);
      if (res.data.success) {
        localStorage.setItem('smartcargo_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('smartcargo_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        registerTrader,
        registerProvider,
        logout,
        refreshUser,
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
