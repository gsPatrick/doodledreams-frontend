// src/components/ProductPage/RelatedProducts.js

'use client';

import React from 'react';
import styles from './RelatedProducts.module.css'; // Usaremos os mesmos estilos
import ProductCard from '@/components/ProductCard/ProductCard'; 
import { motion } from 'framer-motion';

const RelatedProducts = ({ products }) => {
  // Se não houver produtos, o componente não renderiza nada.
  if (!products || products.length === 0) {
    return null; 
  }

  return (
    // Usamos a mesma estrutura de container que as outras seções de produto
    <motion.section 
      className={styles.relatedSection}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className={styles.sectionTitle}>Você também pode gostar</h2>
      
      {/* O grid que contém os cards */}
      <div className={styles.productsGrid}>
        {/* 
          Mapeamos a lista de 'products' recebida via props.
          Para cada 'product' na lista, renderizamos um ProductCard.
          Passamos o objeto 'product' completo para o ProductCard.
          O ProductCard já foi ajustado para saber como extrair a imagem e o preço.
        */}
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index} 
          />
        ))}
      </div>
    </motion.section>
  );
};

export default RelatedProducts;