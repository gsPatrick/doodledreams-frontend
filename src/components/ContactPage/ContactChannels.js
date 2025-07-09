'use client';

import React from 'react';
import styles from './ContactPage.module.css';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { BsEnvelopeHeart } from 'react-icons/bs';

const channels = [
  {
    icon: <FaWhatsapp />,
    title: 'Conversa Rápida',
    description: 'Nosso WhatsApp está aberto para suas dúvidas e ideias instantâneas.',
    href: 'https://wa.me/5511954728628', // Coloque seu número de WhatsApp aqui
    bgColor: '#e0f8e4', // Verde pastel
    iconColor: '#25D366'
  },
  {
    icon: <BsEnvelopeHeart />,
    title: 'Carta Mágica',
    description: 'Para mensagens mais detalhadas, envie-nos um email carinhoso.',
    href: 'mailto:contato@doodledreams.com.br',
    bgColor: '#fce8f0', // Rosa pastel
    iconColor: '#e73b7a'
  },
  {
    icon: <FaInstagram />,
    title: 'Galeria de Sonhos',
    description: 'Inspire-se e fale conosco através do nosso Instagram.',
    href: 'https://www.instagram.com/doodle_dreams.colorir?igsh=eGNsbHFjeDV0azlq', // Coloque o link do seu Instagram
    bgColor: '#f3f0f9', // Roxo pastel
    iconColor: '#C13584'
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

const ContactChannels = () => {
  return (
    <motion.div
      className={styles.channelsContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {channels.map((channel, index) => (
        <motion.a
          key={index}
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.channelCard}
          variants={itemVariants}
          whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
          style={{ backgroundColor: channel.bgColor }}
        >
          <div className={styles.channelIcon} style={{ color: channel.iconColor }}>
            {channel.icon}
          </div>
          <h3 className={styles.channelTitle}>{channel.title}</h3>
          <p className={styles.channelDescription}>{channel.description}</p>
          <div className={styles.channelLink}>
            Conectar Agora →
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
};

export default ContactChannels;