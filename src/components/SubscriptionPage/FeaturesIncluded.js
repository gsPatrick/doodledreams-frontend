'use client';
import React from 'react'; // Não precisa do useRef aqui
import { motion } from 'framer-motion';
import styles from './FeaturesIncluded.module.css';
import { BsBook, BsPhone, BsArrowRepeat, BsHeadphones } from 'react-icons/bs';

// SOLUÇÃO: Em vez de <BsBook />, guardamos apenas a referência ao componente BsBook.
const featuresData = [
  { IconComponent: BsBook, title: "Acesso Ilimitado", description: "Leia quantos livros quiser, quando quiser" },
  { IconComponent: BsPhone, title: "Leitura Offline", description: "Baixe os livros para ler sem internet" },
  { IconComponent: BsArrowRepeat, title: "Sincronização", description: "Continue a leitura de onde parou em qualquer dispositivo" },
  { IconComponent: BsHeadphones, title: "Audiobooks", description: "Escute seus livros favoritos onde estiver" }
];

const FeaturesIncluded = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.sectionTitle}>Todos os planos incluem</h2>
      <motion.div
        className={styles.featuresGrid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {featuresData.map((feature, index) => {
          // SOLUÇÃO: Aqui, criamos uma variável com a referência e a usamos como um componente.
          const Icon = feature.IconComponent;
          return (
            <motion.div key={index} className={styles.featureCard} variants={cardVariants} whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"}}>
              <div className={styles.iconWrapper}>
                <Icon /> {/* Usando o componente aqui */}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default FeaturesIncluded;