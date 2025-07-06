'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Para saber quando a verificação inicial terminou
  const router = useRouter();

  useEffect(() => {
    // Ao carregar a aplicação, verifica se há dados no localStorage
    try {
      const storedToken = localStorage.getItem('doodle_token');
      const storedUser = localStorage.getItem('doodle_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Falha ao carregar dados de autenticação do localStorage", error);
      // Limpa em caso de erro (ex: JSON inválido)
      localStorage.removeItem('doodle_token');
      localStorage.removeItem('doodle_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('doodle_token', authToken);
    localStorage.setItem('doodle_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    router.push('/my-account'); // Redireciona para a página da conta após o login
  };

  const logout = () => {
    localStorage.removeItem('doodle_token');
    localStorage.removeItem('doodle_user');
    setToken(null);
    setUser(null);
    router.push('/auth'); // Redireciona para a página de login após o logout
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