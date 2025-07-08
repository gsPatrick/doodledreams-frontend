'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';
// 1. Importar o ícone de coração
import { BsHeart } from 'react-icons/bs';

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
    e.preventDefault();
    e.stopPropagation();
    console.log(`Adicionar ${product.name} ao carrinho!`);
  };

  // 2. Criar a função para adicionar aos favoritos
  const handleAddToFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Adicionar ${product.name} aos favoritos!`);
  };

  const numericPrice = Number(product.price) || 0;

  const buttonColor = product.buttonColor === 'purple' 
    ? 'var(--doodle-pink-pastel)' 
    : 'var(--doodle-purple-light)';
  
  const hoverColor = product.buttonColor === 'purple'
    ? 'var(--doodle-purple-soft)'
    : 'var(--doodle-blue-soft)';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={styles.productCard}
    >
      <Link href={`/product/${product.slug}`} className={styles.productLink}>
        {product.isNew && <span className={styles.newBadge}>Novo!</span>}
        
        <div className={styles.productImageContainer}>
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            className={styles.productImage}
          />
        </div>

        <div className={styles.productInfo}>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>R$ {numericPrice.toFixed(2).replace('.', ',')}</p>
        </div>
      </Link>

      <div className={styles.cardActions}>
          
      </div>
    </motion.div>
  );
};

export default ProductCard;