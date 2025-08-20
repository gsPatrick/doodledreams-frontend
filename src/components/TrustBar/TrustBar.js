'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './TrustBar.module.css';
// Importando todos os ícones necessários
import { BsPeople, BsShieldCheck, BsTruck, BsPatchCheck, BsStars } from 'react-icons/bs';

// CORREÇÃO: Estrutura de dados com 5 itens distintos
const trustData = [
  { 
    id: 'clients',
    icon: <BsPeople />, 
    text: "+50000 Pessoas", 
    subtext: "Já coloriram seus sonhos" 
  },
  { 
    id: 'security',
    icon: <BsShieldCheck />, 
    text: "Compra Segura", 
    subtext: "com MercadoPago" 
  },
  { 
    id: 'freeShipping', 
    icon: <BsStars />, 
    text: "Frete Grátis", 
    subtext: "Para Presidente Epitácio-SP" 
  },
  { 
    id: 'nationalShipping', // CARD RESTAURADO
    icon: <BsTruck />, 
    text: "Frete Fixo", 
    subtext: "R$ 9,90 para todo o Brasil" 
  },
  { 
    id: 'guarantee',
    icon: <BsPatchCheck />, 
    text: "Nossa Garantia", 
    subtext: "Satisfação ou seu dinheiro de volta" 
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const TrustBar = () => {
  return (
    <motion.section
      className={styles.trustBarSection}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {trustData.map((item) => (
        <motion.div 
          key={item.id} 
          className={styles.trustItem} 
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className={styles.trustIcon}>{item.icon}</div>
          <div className={styles.trustText}>
            <h4>{item.text}</h4>
            <p>{item.subtext}</p>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
};

export default TrustBar;
