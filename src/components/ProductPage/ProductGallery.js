'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGallery = ({ images }) => {
  // Verificação de segurança: Se não houver imagens ou o array estiver vazio, define um estado inicial seguro.
  const initialImage = (images && images.length > 0) ? images[0] : null;
  const [mainImage, setMainImage] = useState(initialImage);

  // Se o array de imagens mudar (ex: em uma navegação SPA), atualiza a imagem principal.
  useEffect(() => {
    setMainImage((images && images.length > 0) ? images[0] : null);
  }, [images]);

  // Se não houver imagem inicial, renderiza um placeholder.
  if (!mainImage) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.mainImageWrapper}>
            <div className={styles.placeholder}>
                <span>Sem imagem</span>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={mainImage.src} // A chave garante que a animação rode a cada troca de imagem
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              width={600}
              height={600}
              priority // Imagem principal do produto deve ser priorizada
              className={styles.mainImage}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Só renderiza as miniaturas se houver mais de uma imagem */}
      {images.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`${styles.thumbnailWrapper} ${mainImage.src === image.src ? styles.active : ''}`}
              onClick={() => setMainImage(image)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={100}
                height={100}
                className={styles.thumbnailImage}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProductGallery;