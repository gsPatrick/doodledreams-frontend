'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import styles from './CartPage.module.css';

const CartItemList = () => {
  const { cartItems } = useCart();

  return (
    <div className={styles.itemListContainer}>
      {cartItems.map(item => (
        <CartItem key={`${item.id}-${item.variation.id}`} item={item} />
      ))}
    </div>
  );
};

export default CartItemList;