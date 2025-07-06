'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import styles from './CheckoutPage.module.css';

const OrderSummary = () => {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.variation.price * item.quantity,
    0
  );
  
  // Simulação de frete e total
  const shippingCost = 15.00;
  const total = subtotal + shippingCost;

  return (
    <div className={styles.summaryContainer}>
      <h3>Resumo do Pedido</h3>
      <div className={styles.summaryItemsList}>
        {cartItems.map(item => (
          <div key={`${item.id}-${item.variation.id}`} className={styles.summaryItem}>
            <div className={styles.summaryItemImage}>
              <Image src={item.images[0].src} alt={item.name} width={60} height={60} />
              <span className={styles.summaryItemQuantity}>{item.quantity}</span>
            </div>
            <div className={styles.summaryItemDetails}>
              <p>{item.name}</p>
              <span>{item.variation.name}</span>
            </div>
            <p className={styles.summaryItemPrice}>R$ {(item.variation.price * item.quantity).toFixed(2).replace('.', ',')}</p>
          </div>
        ))}
      </div>
      <div className={styles.summaryTotals}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Frete</span>
          <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
          <span>Total</span>
          <span>R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;