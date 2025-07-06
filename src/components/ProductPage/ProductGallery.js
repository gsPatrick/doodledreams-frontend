'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={mainImage.src}
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
              priority
              className={styles.mainImage}
            />
          </motion.div>
        </AnimatePresence>
      </div>
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
    </div>
  );
};
export default ProductGallery;