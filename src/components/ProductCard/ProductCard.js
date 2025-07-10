// src/components/ProductCard/ProductCard.js

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const ProductCard = ({ product, index }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);

  const { isAuthenticated } = useAuth();

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

  useEffect(() => {
    if (isAuthenticated && product.id) {
      setIsLoadingFavorite(true);
      api.get(`/favoritos/verificar/${product.id}`)
        .then(response => {
          setIsFavorite(response.data.isFavorito);
        })
        .catch(error => {
          console.error("Erro ao verificar favorito:", error);
          setIsFavorite(false);
        })
        .finally(() => {
          setIsLoadingFavorite(false);
        });
    } else {
      setIsFavorite(false);
      setIsLoadingFavorite(false);
    }
  }, [isAuthenticated, product.id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert("Você precisa estar logado para adicionar produtos aos favoritos.");
      return;
    }

    setIsLoadingFavorite(true);
    try {
      if (isFavorite) {
        await api.delete(`/favoritos/${product.id}`);
        setIsFavorite(false);
      } else {
        await api.post('/favoritos', { produtoId: product.id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error.response?.data?.erro || error.message);
      alert("Ocorreu um erro ao atualizar sua lista de desejos. Tente novamente.");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const imageSrc = product.imageSrc || product.imagens?.[0] || 'https://placehold.co/400x400.png';
  // Removido o cálculo de preço aqui, pois ele não será exibido.

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={styles.productCard}
    >
      <Link href={`/product/${product.slug || product.id}`} className={styles.productLink}>
        {product.isNew && <span className={styles.newBadge}>Novo!</span>}
        
        <div className={styles.productImageContainer}>
          <Image
            src={imageSrc}
            alt={product.name || 'Produto'}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            className={styles.productImage}
          />
        </div>

        <div className={styles.productInfo}>
            <h3 className={styles.productName}>{product.name || 'Nome Indisponível'}</h3>
        </div>
      </Link>

      <div className={styles.cardActions}>
          <Link href={`/product/${product.slug || product.id}`} className={styles.viewDetailsButton}>
              Ver Detalhes
          </Link>

          <motion.button 
            className={`${styles.addToFavoritesButton} ${isFavorite ? styles.isFavorite : ''}`}
            onClick={handleToggleFavorite}
            disabled={isLoadingFavorite}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoadingFavorite ? (
              <>
                {isFavorite ? <BsHeartFill /> : <BsHeart />} Carregando...
              </>
            ) : isFavorite ? (
              <>
                <BsHeartFill /> Remover dos Favoritos
              </>
            ) : (
              <>
                <BsHeart /> Adicionar aos Favoritos
              </>
            )}
          </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;