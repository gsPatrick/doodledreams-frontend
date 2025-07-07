// src/components/AccountPage/DigitalDownloads.js

'use client';

import React from 'react';
import styles from './AccountPage.module.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsDownload, BsPalette } from 'react-icons/bs'; // Ícone de download
import Link from 'next/link'; // Importar Link

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
        Aqui estão todos os seus livros em PDF e arquivos digitais. Clique no ícone de download para obter sua magia!
      </p>
      <div className={styles.downloadList}>
        {downloads && downloads.length > 0 ? (
          downloads.map((item) => (
            // Usar produtoId como chave única para o card do produto digital
            <motion.div
              key={item.produtoId} 
              className={styles.downloadCard}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
            >
              {/* Imagem do Produto */}
              <Image
                src={item.imagemUrl || 'https://placehold.co/80x80.png'} // Usa imagem do produto
                alt={item.nome}
                width={80}
                height={80}
                className={styles.downloadImage}
                 unoptimized={item.imagemUrl.includes('placehold.co')}
              />
              <div className={styles.downloadInfo}>
                <h4>{item.nome}</h4> {/* Nome do produto digital */}
                {item.slug && <p>Produto: {item.slug}</p>} 
                 <p>Arquivos disponíveis: {item.arquivos?.length || 0}</p>
              </div>
              
              <div className={styles.downloadActions}> 
                 {item.arquivos && item.arquivos.length > 0 ? (
                     item.arquivos.map(file => (
                          <motion.a
                            // Usa a URL COMPLETA do arquivo para o link de download
                            href={file.fullUrl || file.url || '#'} 
                            download={file.nome} // Sugere o nome do arquivo para download
                            key={file.id || file.url} // Usa ID do arquivo ou URL como chave
                            className={styles.downloadButton}
                            whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Baixar ${file.nome}`}
                            title={`Baixar: ${file.nome}`} 
                          >
                            <BsDownload /> {/* Ícone de Download */}
                          </motion.a>
                     ))
                 ) : (
                    <p className={styles.infoTextSmall}>Sem arquivos digitais associados.</p>
                 )}
              </div>
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