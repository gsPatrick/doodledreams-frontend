// src/components/CheckoutPage/steps/PaymentStep.js

'use client';

import React, { useState } from 'react';
import styles from '../CheckoutPage.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BsCreditCard } from 'react-icons/bs';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// Recebe finalAppliedCoupon
const PaymentStep = ({ onComplete, onPrev, finalShippingMethod, finalUserData, cartItems, finalAppliedCoupon }) => {
  const [paymentMethod, setPaymentMethod] = useState('mercado_pago');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const router = useRouter();
  const { clearCart } = useCart();

  const handleFinalize = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError('');

    if (!finalUserData || !finalShippingMethod || cartItems.length === 0) {
        setPaymentError('Informações incompletas. Por favor, volte aos passos anteriores.');
        setIsLoading(false);
        return;
    }

    try {
        const orderPayload = {
             itens: cartItems.map(item => ({
                 produtoId: item.id,
                 variacaoId: item.variation.id,
                 quantidade: item.quantity
             })),
             freteId: finalShippingMethod.id, 
             enderecoEntrega: finalUserData,
             // --- APLICAÇÃO REAL DO CUPOM ACONTECE AQUI ---
             cupomCodigo: finalAppliedCoupon ? finalAppliedCoupon.codigo : null, 
        };

        const orderResponse = await api.post('/pedidos', orderPayload);
        const newOrder = orderResponse.data;

        const paymentResponse = await api.post('/pagamentos/checkout', { 
            pedidoId: newOrder.id 
        });
        const { checkoutUrl, sandboxUrl } = paymentResponse.data;

        const redirectUrl = process.env.NODE_ENV === 'production' ? checkoutUrl : sandboxUrl;
        
        clearCart(); 

        // Adiciona um pequeno delay para garantir que o estado do carrinho seja limpo antes do redirecionamento
        setTimeout(() => {
             window.location.href = redirectUrl;
        }, 150); 

    } catch (err) {
        setPaymentError(err.response?.data?.erro || 'Não foi possível finalizar a compra. Tente novamente.');
    } finally {
        setIsLoading(false);
    }
  };

  const renderPaymentForm = () => {
    switch(paymentMethod) {
      case 'mercado_pago':
        return (
          <motion.div key="mercado_pago" initial={{opacity: 0}} animate={{opacity: 1}} className={styles.paymentInfo}>
            <BsCreditCard />
            <h4>Pague com Mercado Pago</h4>
            <p>Você será redirecionado para o site do Mercado Pago para concluir o pagamento com Pix, boleto ou cartão.</p>
          </motion.div>
        );
      default: return null; 
    }
  };

  return (
    <form onSubmit={handleFinalize}>
      <div className={styles.paymentMethodSelector}>
        <label className={paymentMethod === 'mercado_pago' ? styles.active : ''}>
          <input 
            type="radio" 
            name="payment" 
            value="mercado_pago" 
            checked={paymentMethod === 'mercado_pago'} 
            onChange={e => setPaymentMethod(e.target.value)} 
          />
          <BsCreditCard /> Mercado Pago
        </label>
      </div>
      
      <AnimatePresence mode="wait">
        {renderPaymentForm()}
      </AnimatePresence>

      {paymentError && <p className={styles.errorMessage}>{paymentError}</p>}

      <div className={styles.stepActions}>
        <button type="button" onClick={onPrev} className={styles.prevButton} disabled={isLoading}>Voltar</button>
        <button type="submit" className={styles.finalizeButton} disabled={isLoading || !paymentMethod}>
          {isLoading ? 'Finalizando...' : 'Finalizar e Pagar'}
        </button>
      </div>
    </form>
  );
};

export default PaymentStep;