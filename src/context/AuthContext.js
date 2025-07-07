// context/AuthContext.js

'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // A verificação já está dentro do useEffect, que só roda no cliente,
    // mas adicionar a verificação explícita é uma boa prática.
    if (typeof window !== 'undefined') {
      try {
        const storedToken = localStorage.getItem('doodle_token');
        const storedUser = localStorage.getItem('doodle_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Falha ao carregar dados de autenticação do localStorage", error);
        localStorage.removeItem('doodle_token');
        localStorage.removeItem('doodle_user');
      }
    }
    setIsLoading(false); // Move para fora do if para garantir que sempre seja definido
  }, []);

  const login = (userData, authToken) => {
    // localStorage só será acessado aqui no cliente, o que é seguro.
    localStorage.setItem('doodle_token', authToken);
    localStorage.setItem('doodle_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    router.push('/my-account');
  };

  const logout = () => {
    localStorage.removeItem('doodle_token');
    localStorage.removeItem('doodle_user');
    setToken(null);
    setUser(null);
    router.push('/auth');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};