'use client';

import React from 'react';
import styles from './FilterSidebar.module.css';
import { motion } from 'framer-motion';

const categories = [
  { id: 'infantil', name: 'Infantil' },
  { id: 'juvenil', name: 'Juvenil' },
  { id: 'adulto', name: 'Adulto' },
  { id: 'tematico', name: 'Temáticos' },
  { id: 'artigosDiversos', name: 'Artigos Diversos' },
];

const FilterSidebar = ({ filters, setFilters }) => {
  const handleCategoryChange = (categoryId) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    setFilters({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Garante que o valor não seja negativo
    const newValue = Math.max(0, Number(value));
    setFilters({ ...filters, price: { ...filters.price, [name]: newValue } });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      price: { min: 0, max: 100 },
      sort: 'popularity',
    });
  };

  return (
    <motion.aside 
      className={styles.sidebar}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.decorativeDot}></div>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Categorias</h3>
        <ul className={styles.filterList}>
          {categories.map((category) => (
            <li key={category.id} className={styles.checkboxItem}>
              <input
                type="checkbox"
                id={category.id}
                name={category.id}
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              <label htmlFor={category.id}>{category.name}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Faixa de Preço</h3>
        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <label htmlFor="min">Mín.</label>
            <input
              type="text" // Usar text para poder formatar com 'R$'
              id="min"
              name="min"
              value={`R$ ${filters.price.min}`}
              onChange={(e) => handlePriceChange({ target: { name: 'min', value: e.target.value.replace('R$ ', '') } })}
            />
          </div>
          <div className={styles.priceField}>
            <label htmlFor="max">Máx.</label>
            <input
              type="text"
              id="max"
              name="max"
              value={`R$ ${filters.price.max}`}
              onChange={(e) => handlePriceChange({ target: { name: 'max', value: e.target.value.replace('R$ ', '') } })}
            />
          </div>
        </div>
        {/* Placeholder para o range slider visual, estilizado para se parecer com a imagem */}
        <div className={styles.rangeSliderBar}></div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Ordenar por</h3>
        <div className={styles.selectWrapper}>
          <select 
            className={styles.sortSelect}
            value={filters.sort}
            onChange={(e) => setFilters({...filters, sort: e.target.value})}
          >
            <option value="popularity">Mais Populares</option>
            <option value="newest">Mais Recentes</option>
            <option value="price-asc">Preço: Menor para Maior</option>
            <option value="price-desc">Preço: Maior para Menor</option>
          </select>
        </div>
      </div>

      <motion.button
        className={styles.clearButton}
        onClick={clearFilters}
        whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
        whileTap={{ scale: 0.95 }}
      >
        Limpar Filtros
      </motion.button>
    </motion.aside>
  );
};

export default FilterSidebar;