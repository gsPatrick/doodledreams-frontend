'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './CartPage.module.css';
import { BsDash, BsPlus, BsTrash } from 'react-icons/bs';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (amount) => {
    updateQuantity(item.id, item.variation.id, item.quantity + amount);
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImageWrapper}>
        <Image
          src={item.images[0].src} // Usando a primeira imagem do produto
          alt={item.name}
          width={100}
          height={100}
          className={styles.itemImage}
        />
      </div>
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <p className={styles.itemVariation}>Variação: {item.variation.name}</p>
        <div className={styles.quantitySelector}>
          <button onClick={() => handleQuantityChange(-1)} aria-label="Diminuir quantidade"><BsDash /></button>
          <span>{item.quantity}</span>
          <button onClick={() => handleQuantityChange(1)} aria-label="Aumentar quantidade"><BsPlus /></button>
        </div>
      </div>
      <div className={styles.itemPriceAndActions}>
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