'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 1. Importar o componente Link
import { useCart } from '@/context/CartContext';
import styles from './CartPage.module.css'; // Assumindo que este é o CSS correto
import { BsDash, BsPlus, BsTrash } from 'react-icons/bs';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (amount) => {
    updateQuantity(item.id, item.variation.id, item.quantity + amount);
  };
  
  const imageUrl = item.imageSrc || 'https://placehold.co/100x100/EEE/333?text=Sem+Imagem';

  // 2. Definir a URL do produto para o Link
  const productUrl = `/product/${item.slug || item.id}`;

  return (
    <div className={styles.cartItem}>
      {/* 3. Agrupar a imagem e os detalhes em um único Link */}
      <Link href={productUrl} className={styles.itemLinkWrapper}>
        <div className={styles.itemImageWrapper}>
          <Image
            src={imageUrl}
            alt={item.name}
            width={100}
            height={100}
            className={styles.itemImage}
          />
        </div>
        <div className={styles.itemDetails}>
          <h3 className={styles.itemName}>{item.name}</h3>
          <p className={styles.itemVariation}>Variação: {item.variation.name}</p>
          {/* O seletor de quantidade foi movido para fora do link para evitar cliques acidentais */}
        </div>
      </Link>

      {/* 4. Ações (quantidade, preço, remover) permanecem fora do Link */}
      <div className={styles.itemActions}>
        <div className={styles.quantitySelector}>
          <button onClick={() => handleQuantityChange(-1)} aria-label="Diminuir quantidade"><BsDash /></button>
          <span>{item.quantity}</span>
          <button onClick={() => handleQuantityChange(1)} aria-label="Aumentar quantidade"><BsPlus /></button>
        </div>
        <p className={styles.itemPrice}>
          R$ {(item.variation.price * item.quantity).toFixed(2).replace('.', ',')}
        </p>
        <button 
          onClick={() => removeFromCart(item.id, item.variation.id)}
          className={styles.removeButton}
          aria-label="Remover item"
        >
          <BsTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;