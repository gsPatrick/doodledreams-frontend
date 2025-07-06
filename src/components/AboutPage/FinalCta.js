'use client'; // Marcar como Client Component permite usar Framer Motion para animações de hover

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './FinalCta.module.css';

const FinalCta = () => {
  return (
    <div className={styles.ctaSection}>
      <h2 className={styles.ctaTitle}>Pronto para começar sua aventura?</h2>
      <p className={styles.ctaDescription}>
        Nossas coleções estão repletas de mundos esperando para serem coloridos. Encontre o seu próximo livro favorito hoje mesmo!
      </p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/catalog" className={styles.ctaButton}>
          Explorar Coleções
        </Link>
      </motion.div>
    </div>
  );
};

export default FinalCta;