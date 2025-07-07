'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CartPage.module.css';
import { motion } from 'framer-motion';
import api from '@/services/api';

// 1. Recebe as novas props: userAddress e isLoadingAddress
const CartSummary = ({ userAddress, isLoadingAddress }) => {
  const { cartItems } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.variation.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  // Função genérica para calcular frete
  const calculateShipping = async (cepToCalculate) => {
    if (!cepToCalculate || cepToCalculate.length < 8) return;
    
    setIsCalculating(true);
    setError('');
    setShippingCost(null);

    try {
      const response = await api.post('/frete/calcular', {
        enderecoDestino: { cep: cepToCalculate },
        itens: cartItems.map(item => ({
          produtoId: item.id,
          quantidade: item.quantity,
          variacaoId: item.variation.id
        }))
      });
      // Pega a primeira opção de frete (ex: PAC)
      const firstOption = response.data[0];
      setShippingCost(parseFloat(firstOption.price));
    } catch (err) {
      setError('Não foi possível calcular o frete.');
      console.error("Erro ao calcular frete:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  // 2. Efeito para calcular o frete automaticamente se um endereço for fornecido
  useEffect(() => {
    if (userAddress && userAddress.cep) {
      calculateShipping(userAddress.cep);
    }
  }, [userAddress]);

  // Função para o formulário manual
  const handleManualShipping = (e) => {
    e.preventDefault();
    calculateShipping(cep);
  };

  return (
    <div className={styles.summaryContainer}>
      <h2>Resumo do Pedido</h2>
      
      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
      </div>

      <div className={styles.shippingSection}>
        <h3>Entrega</h3>
        {/* 3. Lógica condicional de exibição */}
        {isLoadingAddress ? (
            <p>Carregando endereço...</p>
        ) : userAddress ? (
          // Exibe o endereço do usuário se ele existir
          <div className={styles.addressDisplay}>
            <p><strong>{userAddress.apelido || 'Endereço Principal'}</strong></p>
            <p>{userAddress.rua}, {userAddress.numero}</p>
            <p>{userAddress.cidade} - {userAddress.estado}, {userAddress.cep}</p>
            {/* Adicionar um botão para alterar o endereço seria uma boa melhoria futura */}
          </div>
        ) : (
          // Exibe o formulário de CEP se não houver endereço
          <form className={styles.shippingForm} onSubmit={handleManualShipping}>
            <input
              type="text"
              placeholder="Digite seu CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
              maxLength={8}
              className={styles.cepInput}
            />
            <button type="submit" disabled={isCalculating}>
              {isCalculating ? '...' : 'Calcular'}
            </button>
          </form>
        )}
        
        {/* Exibe o resultado do frete */}
        {isCalculating && <p>Calculando frete...</p>}
        {error && <p className={styles.shippingError}>{error}</p>}
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
        disabled={shippingCost === null || isCalculating}
      >
        Ir para o Pagamento
      </motion.button>
    </div>
  );
};

export default CartSummary;