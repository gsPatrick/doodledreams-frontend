// src/components/ProductCard/ProductCard.js

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';
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

  // --- LÓGICA DE DADOS ROBUSTA ---

  // 1. Encontrar a URL da imagem:
  //    - Prioridade 1: `product.imageSrc` (se já foi formatado antes)
  //    - Prioridade 2: `product.imagens[0]` (formato direto da sua API)
  //    - Fallback: Um placeholder
  const imageSrc = product.imageSrc || product.imagens?.[0] || 'https://placehold.co/400x400.png';

  // 2. Encontrar o Preço:
  //    - Prioridade 1: Preço da primeira variação, se existir.
  //    - Prioridade 2: Preço direto do objeto `product` (se já foi formatado antes).
  //    - Fallback: 0.00
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
      <Link href={`/product/${product.slug || product.id}`} className={styles.productLink}>
        {product.isNew && <span className={styles.newBadge}>Novo!</span>}
        
        <div className={styles.productImageContainer}>
          <Image
            src={imageSrc} // Usa a URL encontrada
            alt={product.name || 'Produto'}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            className={styles.productImage}
          />
        </div>

        <div className={styles.productInfo}>
            <h3 className={styles.productName}>{product.name || 'Nome Indisponível'}</h3>
            <p className={styles.productPrice}>R$ {formattedPrice}</p>
        </div>
      </Link>

      <div className={styles.cardActions}>
          {/* Botões de Ação (adicionar ao carrinho, etc.) podem ser adicionados aqui */}
      </div>
    </motion.div>
  );
};

export default ProductCard;