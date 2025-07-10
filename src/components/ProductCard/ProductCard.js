// src/components/ProductCard/ProductCard.js

'use client';

import React, { useState, useEffect } from 'react'; // Importar useState e useEffect
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';
// 1. Importar os ícones de coração (vazio e preenchido)
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import api from '@/services/api'; // Para interagir com a API de favoritos
import { useAuth } from '@/context/AuthContext'; // Para verificar se o usuário está logado

const ProductCard = ({ product, index }) => {
  const [isFavorite, setIsFavorite] = useState(false); // Estado para controlar se é favorito
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true); // Estado de carregamento do favorito

  const { isAuthenticated } = useAuth(); // Obtém o status de autenticação

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

  // 2. Efeito para verificar o status de favorito ao carregar o componente
  useEffect(() => {
    // Só verifica se o usuário está autenticado e o produto tem um ID
    if (isAuthenticated && product.id) {
      setIsLoadingFavorite(true);
      api.get(`/favoritos/verificar/${product.id}`)
        .then(response => {
          setIsFavorite(response.data.isFavorito);
        })
        .catch(error => {
          console.error("Erro ao verificar favorito:", error);
          setIsFavorite(false); // Assume que não é favorito em caso de erro
        })
        .finally(() => {
          setIsLoadingFavorite(false);
        });
    } else {
      setIsFavorite(false); // Se não está autenticado, não pode ser favorito
      setIsLoadingFavorite(false);
    }
  }, [isAuthenticated, product.id]); // Re-executa se a autenticação ou o ID do produto mudar


  // 3. Função para adicionar/remover dos favoritos
  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Previne a navegação para a página do produto
    e.stopPropagation(); // Previne que o clique no botão ative o Link pai
    
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

  // 4. Lógica de dados robusta para imagem e preço (já estava boa, só mantendo)
  const imageSrc = product.imageSrc || product.imagens?.[0] || 'https://placehold.co/400x400.png';
  const firstVariation = product.variacoes?.[0];
  const priceAsNumber = Number(firstVariation?.preco) || Number(product.price) || 0;
  const formattedPrice = priceAsNumber.toFixed(2).replace('.', ',');


  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={styles.productCard}
    >
      {/* O Link agora envolve apenas a imagem e o nome/preço, para que os botões tenham cliques independentes */}
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
            {/* 5. Preço REMOVIDO daqui */}
        </div>
      </Link>

      {/* 6. Nova seção para as ações (botões) */}
      <div className={styles.cardActions}>
          {/* Botão "Ver Detalhes" */}
          <Link href={`/product/${product.slug || product.id}`} className={styles.viewDetailsButton}>
              Ver Detalhes
          </Link>

          {/* Botão "Adicionar/Remover dos Favoritos" */}
          <motion.button 
            className={`${styles.addToFavoritesButton} ${isFavorite ? styles.isFavorite : ''}`}
            onClick={handleToggleFavorite}
            disabled={isLoadingFavorite} // Desabilita enquanto verifica/atualiza
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Ícone muda com base no estado `isFavorite` */}
            {isLoadingFavorite ? (
              '...' // Ou um spinner
            ) : isFavorite ? (
              <BsHeartFill />
            ) : (
              <BsHeart />
            )}
            {/* Texto opcional: {isFavorite ? 'Favorito' : 'Favoritar'} */}
          </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;