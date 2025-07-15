'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './MercadoPagoBanner.module.css';
import { BsCreditCard2Front, BsCashCoin, BsBank, BsShieldLockFill } from 'react-icons/bs';

const MercadoPagoBanner = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.section
      className={styles.mercadopagoSection}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className={styles.bannerContent}>
        {/* --- ALTERADO: Coluna da Logo e Selos --- */}
        <div className={styles.leftColumn}>
          <div className={styles.mercadopagoLogoContainer}>
            <Image
              src="/imagens/mercado-pago-1.png" 
              alt="Logo Mercado Pago"
              width={180}
              height={50}
              className={styles.mercadopagoLogo}
            />
          </div>
          <div className={styles.securityBadges}>
            <div className={styles.securityBadge}>
              <BsShieldLockFill />
              <span>Compra 100% Segura</span>
            </div>
            <div className={styles.securityBadge}>
              <BsShieldLockFill />
              <span>Pagamento Criptografado</span>
            </div>
          </div>
        </div>
        
        {/* --- ALTERADO: Coluna Central de Informações --- */}
        <div className={styles.centerColumn}>
          <h3 className={styles.title}>Pagamento Fácil e Seguro</h3>
          <p className={styles.description}>
            Todas as suas transações são processadas com a tecnologia do Mercado Pago, garantindo a máxima segurança e a conveniência de pagar com Pix, boleto bancário ou seu cartão de crédito preferido.
          </p>
          <div className={styles.paymentIcons}>
            <BsCreditCard2Front />
            <BsCashCoin />
            <BsBank />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MercadoPagoBanner;