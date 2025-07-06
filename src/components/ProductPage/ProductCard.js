'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { motion } from 'framer-motion';
import { BsCartPlus } from 'react-icons/bs'; // Importar o ícone do carrinho

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

  // Função para lidar com a adição ao carrinho
  const handleAddToCart = (e) => {
    // Impede que o clique no botão ative o Link do card pai
    e.stopPropagation();
    e.preventDefault(); // Garante que o link não será seguido
    
    // Em um app real, você chamaria uma função de um context, etc.
    console.log(`Produto "${product.name}" adicionado ao carrinho!`);
    // Poderia haver um feedback visual aqui, como mudar o ícone
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
            src={product.imageSrc}
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
          {/* Botão de adicionar ao carrinho */}
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