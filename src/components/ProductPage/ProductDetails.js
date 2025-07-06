'use client';
import React, { useState } from 'react';
import styles from './ProductDetails.module.css';
import { motion } from 'framer-motion';
import { BsCartPlus, BsHeart, BsDash, BsPlus, BsCheckLg } from 'react-icons/bs';
import { useCart } from '@/context/CartContext';

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  // Garante que a primeira variação seja selecionada por padrão
  const [selectedVariation, setSelectedVariation] = useState(product.variations[0]);
  const [added, setAdded] = useState(false); // Estado para feedback visual
  const { addToCart } = useCart();

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleVariationChange = (variation) => {
    setSelectedVariation(variation);
  };

  const handleAddToCart = () => {
    // O addToCart agora espera um objeto 'product' completo
    // que já inclui as imagens e outras infos necessárias
    addToCart(product, quantity, selectedVariation);
    
    // Feedback visual para o usuário
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2500); // O botão volta ao normal após 2.5 segundos
  };

  return (
    <div className={styles.detailsContainer}>
      <h1 className={styles.productTitle}>{product.name}</h1>
      <p className={styles.productPrice}>R$ {selectedVariation.price.toFixed(2).replace('.', ',')}</p>
      
      <p className={styles.productShortDescription}>
        Um livro encantador para despertar a criatividade. Perfeito para tardes chuvosas e momentos de calma.
      </p>

      <div className={styles.variationsContainer}>
        <h3 className={styles.variationsLabel}>Variações:</h3>
        {product.variations.map((variation) => (
          <label 
            key={variation.id} 
            className={`${styles.variationItem} ${selectedVariation.id === variation.id ? styles.active : ''}`}
          >
            <input
              type="radio"
              name="product-variation"
              className={styles.variationRadio}
              checked={selectedVariation.id === variation.id}
              onChange={() => handleVariationChange(variation)}
            />
            <div className={styles.variationContent}>
              <span className={styles.variationName}>{variation.name}</span>
              <span className={styles.variationPrice}>R$ {variation.price.toFixed(2).replace('.', ',')}</span>
              <span className={styles.variationStock}>{variation.stock} em estoque</span>
            </div>
          </label>
        ))}
      </div>

      <div className={styles.actionsWrapper}>
        <div className={styles.quantitySelector}>
          <button onClick={() => handleQuantityChange(-1)} aria-label="Diminuir quantidade"><BsDash /></button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange(1)} aria-label="Aumentar quantidade"><BsPlus /></button>
        </div>
        <motion.button 
          className={`${styles.addToCartButton} ${added ? styles.added : ''}`}
          whileHover={{ scale: added ? 1 : 1.05, filter: added ? 'none' : 'brightness(1.1)' }}
          whileTap={{ scale: added ? 1 : 0.95 }}
          onClick={handleAddToCart}
          disabled={added}
        >
          {added ? (
            <>
              <BsCheckLg /> Adicionado!
            </>
          ) : (
            <>
              <BsCartPlus /> Adicionar ao Carrinho
            </>
          )}
        </motion.button>
      </div>

      <motion.button 
        className={styles.wishlistButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <BsHeart /> Adicionar à Lista de Desejos
      </motion.button>
    </div>
  );
};
export default ProductDetails;