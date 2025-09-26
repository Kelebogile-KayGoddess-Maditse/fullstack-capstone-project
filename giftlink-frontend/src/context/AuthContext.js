// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { backendFetch } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      const res = await backendFetch('/api/auth/me');
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const login = async (credentials) => {
    const res = await backendFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await backendFetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  useEffect(() => { loadUser(); }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
