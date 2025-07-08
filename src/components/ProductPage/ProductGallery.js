// src/components/ProductPage/ProductGallery.js

'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BsFillPlayCircleFill } from 'react-icons/bs'; // Ícone para o thumbnail do vídeo

const ProductGallery = ({ arquivoProdutos }) => {

  useEffect(() => {
    console.log(">>> ArquivoProdutos recebidos no ProductGallery:", arquivoProdutos);
  }, [arquivoProdutos]);

  const images = (arquivoProdutos || []).filter(file => file.tipo === 'imagem');
  const videos = (arquivoProdutos || []).filter(file => file.tipo === 'video');

  const initialDisplayedMedia = images.find(img => img.principal)
    ? images.find(img => img.principal)
    : (videos.length > 0 ? videos[0] : images[0] || null);

  const [displayedMedia, setDisplayedMedia] = useState(initialDisplayedMedia);

  useEffect(() => {
    setDisplayedMedia(initialDisplayedMedia);
  }, [arquivoProdutos, initialDisplayedMedia]);

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

  const thumbnails = [];
  if (videos.length > 0) {
      thumbnails.push(videos[0]);
  }
  thumbnails.push(...images);

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainMediaWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={displayedMedia.url}
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
                // <<< MUDANÇA AQUI: Removido layout="fill" e adicionado width/height ou aspectRatio
                width={600} // Ajuste este valor conforme o tamanho desejado
                height={600} // Ajuste este valor conforme o tamanho desejado
                // Se preferir, use aspectRatio em vez de width/height diretamente no CSS
                className={styles.mainImage} // Mantenha a classe para CSS específico
              />
            ) : (
               <video
                  src={displayedMedia.url}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  // A classe 'mainVideo' já pode conter um aspectRatio definido no CSS
                  className={styles.mainVideo}
               >
                 Seu navegador não suporta o elemento de vídeo.
               </video>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {(videos.length + images.length) > 1 && (
        <div className={styles.thumbnailGrid}>
          {thumbnails.map((media, index) => (
             <motion.div
                key={media.id || media.url}
                className={`${styles.thumbnailWrapper} ${displayedMedia.url === media.url ? styles.active : ''}`}
                onClick={() => setDisplayedMedia(media)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
             >
                 {media.tipo === 'imagem' ? (
                    <Image
                       src={media.url}
                       alt={media.nome || 'Miniatura'}
                       // <<< MUDANÇA AQUI: Removido layout="fill"
                       width={100} // Tamanho da miniatura
                       height={100} // Tamanho da miniatura
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