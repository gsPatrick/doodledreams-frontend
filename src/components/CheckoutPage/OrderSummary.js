// src/components/CheckoutPage/OrderSummary.js

'use client';

import React, { useState, useEffect } from 'react';
// Removemos useCart daqui, pois cartItems virá via props
import Image from 'next/image';
import styles from './CheckoutPage.module.css';

// Recebe cartItems e selectedShippingMethod
const OrderSummary = ({ cartItems, selectedShippingMethod }) => {
  // Removemos a linha: const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.variation?.price || item.preco || 0) * item.quantity, // Adapta para estrutura de item no pedido
    0
  );
  
  const shippingCost = selectedShippingMethod ? parseFloat(selectedShippingMethod.price) : 0;
  const total = subtotal + shippingCost;

  return (
    <div className={styles.summaryContainer}>
      <h3>Resumo do Pedido</h3>
      <div className={styles.summaryItemsList}>
        {cartItems.map(item => (
          // Chave ajustada para garantir unicidade com base no ID do produto e variação
          <div key={`${item.id || item.produtoId}-${item.variation?.id || item.variacaoId}`} className={styles.summaryItem}>
            <div className={styles.summaryItemImage}>
              {/* Usa a primeira imagem do produto ou um placeholder */}
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
              {/* Exibe o nome da variação se existir */}
              {item.variation?.name && <span>{item.variation.name}</span>} 
               {/* Fallback se o item veio formatado do pedido (tem nome da variação direto no item.nome) */}
               {!item.variation?.name && item.nome && item.nome.includes(' - ') && <span>{item.nome.split(' - ')[1]}</span>}
            </div>
             {/* Preço usa a variação se disponível, ou o preço base do item se vier do pedido */}
            <p className={styles.summaryItemPrice}>R$ {((item.variation?.price || item.preco || 0) * item.quantity).toFixed(2).replace('.', ',')}</p>
          </div>
        ))}
      </div>
      <div className={styles.summaryTotals}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        {/* Só mostra o frete se um método estiver selecionado */}
        {selectedShippingMethod && (
           <div className={styles.summaryRow}>
             <span>Frete ({selectedShippingMethod.name})</span>
             <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
           </div>
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