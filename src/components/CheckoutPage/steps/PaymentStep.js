'use client';

import React, { useState } from 'react';
import styles from '../CheckoutPage.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BsCreditCard, BsUpcScan, BsFileEarmarkText } from 'react-icons/bs';

const PaymentStep = ({ onPrev }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleFinalize = (e) => {
    e.preventDefault();
    alert('Pedido finalizado com sucesso! (Simulação)');
  };

  const renderPaymentForm = () => {
    switch(paymentMethod) {
      case 'card':
        return (
          <motion.div key="card" initial={{opacity: 0}} animate={{opacity: 1}}>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Número do Cartão</label>
              <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" required />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Validade</label>
                <input type="text" id="expiryDate" placeholder="MM/AA" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cvc">CVC</label>
                <input type="text" id="cvc" placeholder="123" required />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cardName">Nome no Cartão</label>
              <input type="text" id="cardName" required />
            </div>
          </motion.div>
        );
      case 'pix':
        return (
          <motion.div key="pix" initial={{opacity: 0}} animate={{opacity: 1}} className={styles.paymentInfo}>
            <BsUpcScan />
            <h4>Pagamento com PIX</h4>
            <p>Um QR Code será gerado na próxima tela para você escanear com o app do seu banco. O pagamento é aprovado na hora!</p>
          </motion.div>
        );
      case 'boleto':
        return (
          <motion.div key="boleto" initial={{opacity: 0}} animate={{opacity: 1}} className={styles.paymentInfo}>
            <BsFileEarmarkText />
            <h4>Pagamento com Boleto</h4>
            <p>O boleto será gerado ao finalizar a compra e terá um vencimento de 3 dias úteis. A confirmação pode levar até 2 dias.</p>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <form onSubmit={handleFinalize}>
      <div className={styles.paymentMethodSelector}>
        <label className={paymentMethod === 'card' ? styles.active : ''}>
          <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={e => setPaymentMethod(e.target.value)} />
          <BsCreditCard /> Cartão
        </label>
        <label className={paymentMethod === 'pix' ? styles.active : ''}>
          <input type="radio" name="payment" value="pix" checked={paymentMethod === 'pix'} onChange={e => setPaymentMethod(e.target.value)} />
          <BsUpcScan /> PIX
        </label>
        <label className={paymentMethod === 'boleto' ? styles.active : ''}>
          <input type="radio" name="payment" value="boleto" checked={paymentMethod === 'boleto'} onChange={e => setPaymentMethod(e.target.value)} />
          <BsFileEarmarkText /> Boleto
        </label>
      </div>
      
      <AnimatePresence mode="wait">
        {renderPaymentForm()}
      </AnimatePresence>

      <div className={styles.stepActions}>
        <button type="button" onClick={onPrev} className={styles.prevButton}>Voltar</button>
        <button type="submit" className={styles.finalizeButton}>Finalizar Compra</button>
      </div>
    </form>
  );
};

export default PaymentStep;