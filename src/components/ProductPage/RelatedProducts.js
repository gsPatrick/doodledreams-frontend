'use client';

import React from 'react';
import styles from './RelatedProducts.module.css';
// ALTERAÇÃO: Importando o ProductCard correto, de sua pasta própria.
import ProductCard from '@/components/ProductCard/ProductCard'; 
import { motion } from 'framer-motion';

const RelatedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return null; // Não renderiza nada se não houver produtos relacionados
  }

  return (
    <motion.section 
      className={styles.relatedSection}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className={styles.sectionTitle}>Você também pode gostar</h2>
      <div className={styles.productsGrid}>
        {/* Usando o ProductCard correto aqui */}
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default RelatedProducts;