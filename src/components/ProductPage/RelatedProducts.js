'use client';
import React from 'react';
import styles from './RelatedProducts.module.css';
import ProductCard from './ProductCard'; // O card individual de produto
import { motion } from 'framer-motion';

const RelatedProducts = ({ products }) => {
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
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default RelatedProducts;