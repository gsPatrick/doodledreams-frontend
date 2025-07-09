// src/context/FilterContext.js

'use client';

import React, { createContext, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Estado inicial padrão para os filtros
const defaultFilters = {
  categories: [],
  price: { min: 0, max: 100 },
  sort: 'lancamentos',
  limit: 500,
  page: 1,
};

// 1. Criar o Contexto
const FilterContext = createContext();

// 2. Criar o Provedor do Contexto
export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const router = useRouter();

  // Função para limpar os filtros e definir uma única categoria, depois navegar
  const setCategoryAndNavigate = (categoryId) => {
    const newFilters = {
      ...defaultFilters, // Reseta para o padrão
      categories: [categoryId], // Define apenas a categoria clicada
    };
    setFilters(newFilters);
    router.push('/catalog');
  };
  
  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setFilters(defaultFilters);
  }

  const value = {
    filters,
    setFilters,
    setCategoryAndNavigate,
    clearAllFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

// 3. Criar um Hook customizado para facilitar o uso
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};