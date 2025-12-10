import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('petpal_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('petpal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('petpal_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const userData = await api.login(email, password);
    setUser(userData);
  };

  const register = async (data) => {
    const userData = await api.register(data);
    setUser(userData);
  };

  const registerAdmin = async (data) => {
    const userData = await api.registerAdmin(data);
    setUser(userData);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, registerAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);