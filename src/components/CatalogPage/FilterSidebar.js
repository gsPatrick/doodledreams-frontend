// src/components/CatalogPage/FilterSidebar.js

'use client';

import React, { useState, useEffect } from 'react';
import styles from './FilterSidebar.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BsX } from 'react-icons/bs';
import api from '@/services/api';

const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [allCategories, setAllCategories] = useState([]);

  const isDesktop = typeof isOpen === 'undefined';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categorias');
        const formattedCategories = response.data.map(cat => ({
            id: String(cat.id),
            nome: cat.nome
        }));
        setAllCategories(formattedCategories);
      } catch (error) {
        console.error("Falha ao buscar categorias para a Sidebar:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (categoryId) => {
    const newCategories = localFilters.categories.includes(categoryId)
      ? localFilters.categories.filter((c) => c !== categoryId)
      : [...localFilters.categories, categoryId];
    
    const newFilterState = { ...localFilters, categories: newCategories, page: 1 };
    setLocalFilters(newFilterState);

    if (isDesktop) {
      setFilters(newFilterState);
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newValue = value === '' ? '' : Math.max(0, Number(value));
    setLocalFilters({ ...localFilters, price: { ...localFilters.price, [name]: newValue } });
  };
  
  const applyPriceFilter = () => {
      const newFilterState = { ...localFilters, page: 1 };
      setLocalFilters(newFilterState);
      if (isDesktop) {
          setFilters(newFilterState);
      }
  };

  const handleSortChange = (e) => {
      const newSortValue = e.target.value;
      const newFilterState = { ...localFilters, sort: newSortValue, page: 1 };
      setLocalFilters(newFilterState);

      if (isDesktop) {
          setFilters(newFilterState);
      }
  };

  const applyFiltersAndClose = () => {
    setFilters(localFilters);
    if (onClose) onClose();
  };
  
  const clearFilters = () => {
      const cleared = {
          categories: [],
          price: { min: 0, max: 100 },
          sort: 'lancamentos',
          limit: filters.limit,
          page: 1,
      };
      setLocalFilters(cleared);
      setFilters(cleared);
      if(!isDesktop && onClose) onClose();
  };

  const FilterContent = () => (
    <>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Categorias</h3>
        <ul className={styles.filterList}>
          {/* Mapeia as categorias da API para criar os checkboxes dinamicamente */}
          {allCategories.map((category) => (
            <li key={category.id} className={styles.checkboxItem}>
              <input type="checkbox" id={`${category.id}-${isOpen ? 'mobile' : 'desktop'}`} checked={localFilters.categories.includes(category.id)} onChange={() => handleCategoryChange(category.id)} />
              <label htmlFor={`${category.id}-${isOpen ? 'mobile' : 'desktop'}`}>{category.nome}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Faixa de Preço</h3>
        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <label htmlFor={`min-${isOpen ? 'mobile' : 'desktop'}`}>Mín.</label>
            <input 
              type="text" 
              id={`min-${isOpen ? 'mobile' : 'desktop'}`} 
              name="min" 
              value={`R$ ${localFilters.price.min}`} 
              onChange={(e) => handlePriceChange({ target: { name: 'min', value: e.target.value.replace('R$ ', '') } })}
              onBlur={applyPriceFilter}
            />
          </div>
          <div className={styles.priceField}>
            <label htmlFor={`max-${isOpen ? 'mobile' : 'desktop'}`}>Máx.</label>
            <input 
              type="text" 
              id={`max-${isOpen ? 'mobile' : 'desktop'}`} 
              name="max" 
              value={`R$ ${localFilters.price.max}`} 
              onChange={(e) => handlePriceChange({ target: { name: 'max', value: e.target.value.replace('R$ ', '') } })}
              onBlur={applyPriceFilter}
            />
          </div>
        </div>
        <div className={styles.rangeSliderBar}></div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Ordenar por</h3>
        <div className={styles.selectWrapper}>
          <select className={styles.sortSelect} value={localFilters.sort} onChange={handleSortChange}>
            <option value="lancamentos">Mais Recentes</option>
            <option value="mais-vendidos">Mais Populares</option>
            <option value="preco_asc">Preço: Menor para Maior</option>
            <option value="preco_desc">Preço: Maior para Menor</option>
          </select>
        </div>
      </div>
    </>
  );

  if (!isDesktop) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className={styles.overlay} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className={styles.sidebarMobile} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className={styles.mobileHeader}>
                <h4>Filtrar Produtos</h4>
                <button onClick={onClose} className={styles.closeButton}><BsX size={32} /></button>
              </div>
              <div className={styles.mobileContent}><FilterContent /></div>
              <div className={styles.mobileFooter}>
                <button onClick={clearFilters} className={styles.clearButtonMobile}>Limpar</button>
                <button onClick={applyFiltersAndClose} className={styles.applyButton}>Aplicar Filtros</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.decorativeDot}></div>
      <FilterContent />
      <motion.button className={styles.clearButton} onClick={clearFilters} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Limpar Filtros
      </motion.button>
    </aside>
  );
};

export default FilterSidebar;