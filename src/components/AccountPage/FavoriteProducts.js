'use client';

import React from 'react';
import styles from './AccountPage.module.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BsHeartbreak, BsTrash } from 'react-icons/bs';

const FavoriteProducts = ({ favorites }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.contentTitle}>Meus Favoritos</h2>
      {favorites && favorites.length > 0 ? (
        <div className={styles.favoritesGrid}>
          {favorites.map(product => (
            <div key={product.id} className={styles.favoriteCard}>
              <Image 
                src={product.imagens?.[0] || 'https://placehold.co/150x150.png'} 
                alt={product.nome} 
                width={150} 
                height={150} 
              />
              <h4 className={styles.favoriteName}>{product.nome}</h4>
              <p className={styles.favoritePrice}>R$ {product.variacoes?.[0]?.preco.toFixed(2).replace('.', ',') || '0,00'}</p>
              <div className={styles.favoriteActions}>
                <Link href={`/product/${product.slug || product.id}`} className={styles.viewProductBtn}>Ver Produto</Link>
                <button className={styles.removeFavoriteBtn} aria-label="Remover dos favoritos">
                  <BsTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyStateContainer}>
            <BsHeartbreak className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>Nenhum rabisco favorito ainda?</h3>
            <p className={styles.emptyStateText}>Explore nosso catálogo e clique no coração para guardar suas artes preferidas!</p>
        </div>
      )}
    </motion.div>
  );
};

export default FavoriteProducts;