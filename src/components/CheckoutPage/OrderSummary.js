// src/components/CheckoutPage/OrderSummary.js

'use client';

import React from 'react';
import Image from 'next/image';
import styles from './CheckoutPage.module.css';

// Recebe cartItems, selectedShippingMethod, appliedCoupon E allCartItemsAreDigital
const OrderSummary = ({ cartItems, selectedShippingMethod, appliedCoupon, allCartItemsAreDigital }) => {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.variation?.price || item.preco || 0) * item.quantity,
    0
  );

  const subtotalAfterCoupon = appliedCoupon ? appliedCoupon.novoTotalCalculado : subtotal;
  
  // O custo do frete será 0 se for digital, independentemente do selectedShippingMethod
  const shippingCost = allCartItemsAreDigital ? 0 : (selectedShippingMethod ? parseFloat(selectedShippingMethod.price) : 0);
  const total = subtotalAfterCoupon + shippingCost;

  return (
    <div className={styles.summaryContainer}>
      <h3>Resumo do Pedido</h3>
      <div className={styles.summaryItemsList}>
        {cartItems.map(item => (
          <div key={`${item.id || item.produtoId}-${item.variation?.id || item.variacaoId}`} className={styles.summaryItem}>
            <div className={styles.summaryItemImage}>
              <Image 
                 src={item.images?.[0]?.src || item.produto?.imagemUrl || 'https://placehold.co/60x60.png'} 
                 alt={item.name || item.nome} 
                 width={60} 
                 height={60} 
              />
              <span className={styles.summaryItemQuantity}>{item.quantity}</span>
            </div>
            <div className={styles.summaryItemDetails}>
              <p>{item.name || item.nome}</p>
              {item.variation?.name && <span>{item.variation.name}</span>} 
               {!item.variation?.name && item.nome && item.nome.includes(' - ') && <span>{item.nome.split(' - ')[1]}</span>}
            </div>
            <p className={styles.summaryItemPrice}>R$ {((item.variation?.price || item.preco || 0) * item.quantity).toFixed(2).replace('.', ',')}</p>
          </div>
        ))}
      </div>
      <div className={styles.summaryTotals}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>

        {appliedCoupon && (
          <div className={styles.summaryRow}>
            <span>Desconto ({appliedCoupon.codigo})</span>
            <span>-R$ {appliedCoupon.descontoCalculado.toFixed(2).replace('.', ',')}</span>
          </div>
        )}

        {appliedCoupon && (
          <div className={`${styles.summaryRow} ${styles.summarySubtotalWithCoupon}`}>
            <span>Subtotal (com cupom)</span>
            <span>R$ {subtotalAfterCoupon.toFixed(2).replace('.', ',')}</span>
          </div>
        )}

        {/* NOVO: Exibe "Entrega Digital" ou o frete normal */}
        {allCartItemsAreDigital ? (
          <div className={styles.summaryRow}>
            <span>Frete (Entrega Digital)</span>
            <span>R$ 0,00</span>
          </div>
        ) : (
          selectedShippingMethod && (
             <div className={styles.summaryRow}>
               <span>Frete ({selectedShippingMethod.name})</span>
               <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
             </div>
          )
        )}
        <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
          <span>Total</span>
          <span>R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;