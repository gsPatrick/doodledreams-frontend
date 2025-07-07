// src/components/CheckoutPage/steps/PaymentStep.js

'use client';

import React, { useState } from 'react';
import styles from '../CheckoutPage.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BsCreditCard, BsUpcScan, BsFileEarmarkText } from 'react-icons/bs';
import api from '@/services/api'; // Importar API
import { useRouter } from 'next/navigation'; // Importar Router
import { useCart } from '@/context/CartContext'; // Importar useCart

// Recebe finalShippingMethod, finalUserData, cartItems
const PaymentStep = ({ onComplete, onPrev, finalShippingMethod, finalUserData, cartItems }) => {
  const [paymentMethod, setPaymentMethod] = useState('mercado_pago'); // Definir MP como padrão
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const router = useRouter();
  const { clearCart } = useCart(); // Para limpar o carrinho após a compra

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
        // 1. Criar o pedido no backend
        const orderPayload = {
             itens: cartItems.map(item => ({
                 produtoId: item.id,
                 variacaoId: item.variation.id,
                 quantidade: item.quantity
             })),
             // Passar o ID do método de frete selecionado (Melhor Envio ID ou Custom ID)
             freteId: finalShippingMethod.id, 
             // Passar o objeto completo do endereço do Passo 1
             enderecoEntrega: finalUserData,
             // TODO: Adicionar cupomCodigo se aplicável
             // cupomCodigo: ... 
        };

        const orderResponse = await api.post('/pedidos', orderPayload);
        const newOrder = orderResponse.data;

        // 2. Iniciar o pagamento (Mercado Pago Checkout Pro)
        const paymentResponse = await api.post('/pagamentos/checkout', { 
            pedidoId: newOrder.id 
        });
        const { checkoutUrl, sandboxUrl } = paymentResponse.data;

        // 3. Determinar a URL de redirecionamento e logar
        const redirectUrl = process.env.NODE_ENV === 'production' ? checkoutUrl : sandboxUrl;
        console.log("Redirecionando para Mercado Pago:", redirectUrl); // <-- Adicionado console.log

        // 4. Limpar carrinho e chamar onComplete ANTES do redirecionamento
        clearCart(); 
        // onComplete({ success: true, orderId: newOrder.id }); // Desabilitado, pois o redirecionamento sai da página

        // 5. Redirecionar para o Mercado Pago
        // Adicionamos um pequeno delay para o console.log aparecer no navegador,
        // mas não é estritamente necessário para a funcionalidade.
        setTimeout(() => {
             window.location.href = redirectUrl; // <-- Usar window.location.href para redirecionamento externo
             // ou router.push(redirectUrl); // <-- Pode funcionar, mas window.location.href é mais robusto para redirecionamentos externos
        }, 100); // Pequeno delay

    } catch (err) {
        console.error("Erro ao finalizar compra ou iniciar pagamento:", err.response?.data?.erro || err.message);
        setPaymentError(err.response?.data?.erro || 'Não foi possível finalizar a compra. Tente novamente.');
        // Chamar onComplete com falha (opcional)
        // onComplete({ success: false, error: err.response?.data?.erro || err.message });
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
      // TODO: Adicionar outros métodos de pagamento como PIX direto, Boleto direto, etc., se implementados
      default: return null; 
    }
  };

  return (
    <form onSubmit={handleFinalize}>
      <div className={styles.paymentMethodSelector}>
        {/* Opção de Mercado Pago */}
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
        {/* TODO: Adicionar outras opções de pagamento */}
      </div>
      
      <AnimatePresence mode="wait">
        {renderPaymentForm()}
      </AnimatePresence>

      {paymentError && <p className={styles.errorMessage}>{paymentError}</p>}

      <div className={styles.stepActions}>
        <button type="button" onClick={onPrev} className={styles.prevButton} disabled={isLoading}>Voltar</button> {/* Desabilita Voltar durante o processamento */}
        <button type="submit" className={styles.finalizeButton} disabled={isLoading || !paymentMethod}>
          {isLoading ? 'Processando Pagamento...' : 'Finalizar Compra'} {/* Texto descritivo durante o processamento */}
        </button>
      </div>
    </form>
  );
};

export default PaymentStep;