'use client';

import React from 'react';
import styles from './AccountPage.module.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsDownload, BsPalette } from 'react-icons/bs';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DigitalDownloads = ({ downloads }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className={styles.contentTitle}>Meus Downloads Digitais</h2>
      <p className={styles.contentSubtitle}>
        Aqui estão todos os seus livros em PDF e arquivos digitais. Clique para baixar e começar a colorir!
      </p>
      <div className={styles.downloadList}>
        {downloads && downloads.length > 0 ? (
          downloads.map((item) => (
            <motion.div
              key={item.id}
              className={styles.downloadCard}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
            >
              <Image
                src={item.ArquivoProdutos?.[0]?.url || 'https://placehold.co/80x80.png'}
                alt={item.nome}
                width={80}
                height={80}
                className={styles.downloadImage}
              />
              <div className={styles.downloadInfo}>
                <h4>{item.nome}</h4>
                <p>Adquirido em seu último pedido relevante</p>
              </div>
              <motion.a
                href={item.ArquivoProdutos?.[1]?.url || '#'} // Supondo que o segundo arquivo seja o de download
                download
                className={styles.downloadButton}
                whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Baixar ${item.nome}`}
              >
                <BsDownload />
              </motion.a>
            </motion.div>
          ))
        ) : (
            <div className={styles.emptyStateContainer}>
                <BsPalette className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>Sua paleta digital está em branco</h3>
                <p className={styles.emptyStateText}>Quando você comprar um produto digital, ele aparecerá aqui, pronto para colorir.</p>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default DigitalDownloads;