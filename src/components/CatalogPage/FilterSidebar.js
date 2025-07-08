'use client';

import React, { useState, useEffect } from 'react';
import styles from './FilterSidebar.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BsX } from 'react-icons/bs';

const categories = [
  { id: 'infantil', name: 'Infantil' },
  { id: 'juvenil', name: 'Juvenil' },
  { id: 'adulto', name: 'Adulto' },
  { id: 'tematico', name: 'Temáticos' },
  { id: 'artigosDiversos', name: 'Artigos Diversos' },
];

// O componente agora aceita props para controlar o estado mobile
const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
  // Estado local para modificações temporárias no mobile
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    // Sincroniza o estado local se o estado global mudar
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (categoryId) => {
    const newCategories = localFilters.categories.includes(categoryId)
      ? localFilters.categories.filter((c) => c !== categoryId)
      : [...localFilters.categories, categoryId];
    setLocalFilters({ ...localFilters, categories: newCategories });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(0, Number(value));
    setLocalFilters({ ...localFilters, price: { ...localFilters.price, [name]: newValue } });
  };

  // Função para aplicar os filtros e fechar o modal no mobile
  const applyFiltersAndClose = () => {
    setFilters(localFilters);
    if (onClose) onClose();
  };
  
  // Limpa os filtros tanto no local quanto no global
  const clearFilters = () => {
      const cleared = {
          categories: [],
          price: { min: 0, max: 100 },
          sort: 'popularity',
      };
      setLocalFilters(cleared);
      setFilters(cleared); // Limpa o global também
      if(onClose) onClose();
  };

  const FilterContent = () => (
    <>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Categorias</h3>
        {/* ... restante do conteúdo do filtro ... */}
        <ul className={styles.filterList}>
          {categories.map((category) => (
            <li key={category.id} className={styles.checkboxItem}>
              <input type="checkbox" id={`${category.id}-${isOpen ? 'mobile' : 'desktop'}`} checked={localFilters.categories.includes(category.id)} onChange={() => handleCategoryChange(category.id)} />
              <label htmlFor={`${category.id}-${isOpen ? 'mobile' : 'desktop'}`}>{category.name}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Faixa de Preço</h3>
        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <label htmlFor={`min-${isOpen ? 'mobile' : 'desktop'}`}>Mín.</label>
            <input type="text" id={`min-${isOpen ? 'mobile' : 'desktop'}`} name="min" value={`R$ ${localFilters.price.min}`} onChange={(e) => handlePriceChange({ target: { name: 'min', value: e.target.value.replace('R$ ', '') } })} />
          </div>
          <div className={styles.priceField}>
            <label htmlFor={`max-${isOpen ? 'mobile' : 'desktop'}`}>Máx.</label>
            <input type="text" id={`max-${isOpen ? 'mobile' : 'desktop'}`} name="max" value={`R$ ${localFilters.price.max}`} onChange={(e) => handlePriceChange({ target: { name: 'max', value: e.target.value.replace('R$ ', '') } })} />
          </div>
        </div>
        <div className={styles.rangeSliderBar}></div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Ordenar por</h3>
        <div className={styles.selectWrapper}>
          <select className={styles.sortSelect} value={localFilters.sort} onChange={(e) => setLocalFilters({...localFilters, sort: e.target.value})}>
            <option value="popularity">Mais Populares</option>
            <option value="newest">Mais Recentes</option>
            <option value="price-asc">Preço: Menor para Maior</option>
            <option value="price-desc">Preço: Maior para Menor</option>
          </select>
        </div>
      </div>
    </>
  );

  // Se for mobile (identificado pela prop `isOpen`), renderiza o overlay
  if (typeof isOpen !== 'undefined') {
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

  // Se não, renderiza a versão desktop padrão
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