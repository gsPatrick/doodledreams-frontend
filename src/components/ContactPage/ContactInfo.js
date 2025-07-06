'use client';

import React from 'react';
import styles from './ContactPage.module.css';
import { motion } from 'framer-motion';
// CORREÇÃO: Importando cada ícone da sua biblioteca correta. BsPinterestP vem de 'fa'.
import { BsEnvelope, BsPhone, BsPinMap, BsInstagram } from 'react-icons/bs';
import { FaFacebookF, FaPinterestP } from 'react-icons/fa';

const contactMethods = [
  { icon: <BsEnvelope />, title: "Email Mágico", content: "contato@doodledreams.com.br", href: "mailto:contato@doodledreams.com.br" },
  { icon: <BsPhone />, title: "Telefone dos Sonhos", content: "(11) 95472-8628", href: "tel:+5511954728628" },
  { icon: <BsPinMap />, title: "Nosso Ateliê", content: "Rua da Imaginação, 123 - São Paulo, SP", href: "#" }
];

const socialLinks = [
  { icon: <BsInstagram />, label: "Instagram", href: "#" },
  { icon: <FaFacebookF />, label: "Facebook", href: "#" }, // Corrigido para usar o ícone importado corretamente
  { icon: <FaPinterestP />, label: "Pinterest", href: "#" } // Corrigido para usar o ícone importado corretamente
];

const ContactInfo = () => {
  return (
    <div className={styles.infoContainer}>
      <h3>Outras Formas de Conectar</h3>
      <div className={styles.infoCardsWrapper}>
        {contactMethods.map((method, index) => (
          <motion.a
            key={index}
            href={method.href}
            className={styles.infoCard}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          >
            <div className={styles.infoIcon}>{method.icon}</div>
            <div className={styles.infoText}>
              <h4>{method.title}</h4>
              <p>{method.content}</p>
            </div>
          </motion.a>
        ))}
      </div>
      <div className={styles.socialsWrapper}>
        <h4>Siga nossa magia</h4>
        <div className={styles.socialIcons}>
          {socialLinks.map((social, index) => (
            <motion.a key={index} href={social.href} aria-label={social.label} whileHover={{ scale: 1.2, rotate: 10 }}>
              {social.icon}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;