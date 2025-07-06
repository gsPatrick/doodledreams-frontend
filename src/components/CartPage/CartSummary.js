'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CartPage.module.css';
import { motion } from 'framer-motion';

const CartSummary = () => {
  const { cartItems } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.variation.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  const handleCalculateShipping = async (e) => {
    e.preventDefault();
    if (cep.length < 8) {
      alert('Por favor, insira um CEP válido.');
      return;
    }
    setIsCalculating(true);
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Gera um valor de frete aleatório para a simulação
    const randomShipping = Math.random() * (35 - 10) + 10;
    setShippingCost(randomShipping);
    setIsCalculating(false);
  };

  return (
    <div className={styles.summaryContainer}>
      <h2>Resumo do Pedido</h2>
      
      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
      </div>

      <div className={styles.shippingSection}>
        <h3>Calcular Frete</h3>
        <form className={styles.shippingForm} onSubmit={handleCalculateShipping}>
          <input
            type="text"
            placeholder="Digite seu CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))} // Permite apenas números
            maxLength={8}
            className={styles.cepInput}
          />
          <button type="submit" disabled={isCalculating}>
            {isCalculating ? 'Calculando...' : 'Calcular'}
          </button>
        </form>
        {shippingCost !== null && (
          <div className={`${styles.summaryRow} ${styles.shippingResult}`}>
            <span>Frete</span>
            <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
      </div>

      <div className={`${styles.summaryRow} ${styles.totalRow}`}>
        <span>Total</span>
        <span>R$ {(subtotal + (shippingCost || 0)).toFixed(2).replace('.', ',')}</span>
      </div>

      <motion.button
        className={styles.checkoutButton}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        disabled={shippingCost === null} // Desabilita até o frete ser calculado
      >
        Ir para o Pagamento
      </motion.button>
    </div>
  );
};

export default CartSummary;