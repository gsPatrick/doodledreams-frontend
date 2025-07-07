'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';

const buttonColors = {
  blue: 'var(--doodle-purple-soft)',
  purple: 'var(--doodle-pink-pastel)',
  hoverBlue: 'var(--doodle-purple-light)',
  hoverPurple: 'var(--doodle-purple-soft)',
};

const ProductCard = ({ product }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Adicionar ${product.name} ao carrinho!`);
  };

  const numericPrice = Number(product.price) || 0;
  // Define uma cor padrão caso a prop não seja passada
  const colorKey = product.buttonColor === 'purple' ? 'purple' : 'blue';
  const currentButtonColor = buttonColors[colorKey];
  const hoverButtonColor = buttonColors[`hover${colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}`];

  return (
    <motion.div
      className={styles.productCard}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Link href={`/product/${product.slug}`} className={styles.productLink}>
        {product.isNew && <span className={styles.newBadge}>Novo!</span>}
        
        <div className={styles.productImageContainer}>
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 33vw, 20vw"
            className={styles.productImage}
          />
        </div>

        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productPrice}>R$ {numericPrice.toFixed(2).replace('.', ',')}</p>
        </div>
      </Link>

      <motion.button
        className={styles.addToCartButton}
        style={{ backgroundColor: currentButtonColor, borderColor: currentButtonColor }}
        whileHover={{ backgroundColor: hoverButtonColor, borderColor: hoverButtonColor, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={handleAddToCart}
        aria-label={`Adicionar ${product.name} ao carrinho`}
      >
        Adicionar ao Carrinho
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;