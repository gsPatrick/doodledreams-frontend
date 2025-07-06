// src/components/ProductCard/ProductCard.js (verificação final, sem mudanças necessárias)

'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { motion } from 'framer-motion';
import { BsCartPlus } from 'react-icons/bs';

const ProductCard = ({ product, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        delay: index * 0.1
      }
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(`Produto "${product.name}" adicionado ao carrinho!`);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Link href={`/product/${product.slug}`} className={styles.productCard}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.imageSrc} // Correto
            alt={product.name}
            fill
            className={styles.cardImage}
          />
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardText}>
            <h5 className={styles.cardTitle}>{product.name}</h5>
            <p className={styles.cardPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
          <motion.button
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1, backgroundColor: 'var(--doodle-purple-light)' }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <BsCartPlus />
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;