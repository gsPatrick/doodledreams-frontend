// src/components/ProductPage/ProductGallery.js

'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BsFillPlayCircleFill } from 'react-icons/bs';

const ProductGallery = ({ arquivoProdutos }) => {
  // Estado para a mídia principal e para as miniaturas
  const [displayedMedia, setDisplayedMedia] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  
  useEffect(() => {
    // Separa os arquivos por tipo
    const images = (arquivoProdutos || []).filter(file => file.tipo === 'imagem');
    const videos = (arquivoProdutos || []).filter(file => file.tipo === 'video');

    // --- LÓGICA DE SELEÇÃO INICIAL MODIFICADA ---
    // 1. Prioridade para o primeiro vídeo encontrado.
    // 2. Se não houver vídeo, busca a imagem marcada como principal.
    // 3. Se não houver imagem principal, pega a primeira imagem da lista.
    // 4. Se não houver nada, fica nulo.
    const initialMedia = videos[0] || images.find(img => img.principal) || images[0] || null;
    
    setDisplayedMedia(initialMedia);

    // --- LÓGICA PARA MONTAR AS MINIATURAS (THUMBNAILS) ---
    // A ordem das miniaturas será: Vídeo primeiro, depois as imagens.
    const sortedThumbnails = [];
    if (videos.length > 0) {
      sortedThumbnails.push(...videos);
    }
    // Adiciona as imagens, garantindo que a principal venha primeiro se existir
    const sortedImages = [...images].sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0));
    sortedThumbnails.push(...sortedImages);

    setThumbnails(sortedThumbnails);
    
  }, [arquivoProdutos]); // Roda sempre que os arquivos do produto mudarem

  if (!displayedMedia) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.mainMediaWrapper}>
            <div className={styles.placeholder}>
                <span>Sem mídia</span>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainMediaWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={displayedMedia.id || displayedMedia.url} // Usar um ID único
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.displayedMediaContent}
          >
            {displayedMedia.tipo === 'imagem' ? (
              <Image
                src={displayedMedia.url}
                alt={displayedMedia.nome || 'Imagem do produto'}
                width={600}
                height={600}
                className={styles.mainImage}
                priority={true} // Prioriza o carregamento da imagem principal
              />
            ) : (
               <video
                  src={displayedMedia.url}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  className={styles.mainVideo}
               >
                 Seu navegador não suporta o elemento de vídeo.
               </video>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {thumbnails.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {thumbnails.map((media) => (
             <motion.div
                key={media.id || media.url}
                className={`${styles.thumbnailWrapper} ${displayedMedia.id === media.id ? styles.active : ''}`}
                onClick={() => setDisplayedMedia(media)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
             >
                 {media.tipo === 'imagem' ? (
                    <Image
                       src={media.url}
                       alt={media.nome || 'Miniatura'}
                       width={100}
                       height={100}
                       className={styles.thumbnailImage}
                    />
                 ) : (
                   <div className={styles.videoThumbnailPlaceholder}>
                       <BsFillPlayCircleFill className={styles.playIcon} />
                       <span>Vídeo</span>
                   </div>
                 )}
             </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;