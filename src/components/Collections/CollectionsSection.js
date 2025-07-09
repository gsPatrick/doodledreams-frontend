// src/components/Collections/CollectionsSection.js

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFilter } from '@/context/FilterContext'; // Importa o hook do contexto de filtro

import styles from './CollectionsSection.module.css';

// Dados das coleções com IDs ajustados para corresponder ao que o filtro espera
const collectionData = [
  { id: '1', name: 'Infantil', description: '3 a 8 anos', iconPath: '/imagens/lapisduplo.svg', bgColorVar: 'var(--doodle-yellow-light)', linkTextColorVar: 'var(--doodle-blue-soft)', },
  { id: '2', name: 'Juvenil', description: '9 a 14 anos', iconPath: '/imagens/arcoiris.svg', bgColorVar: 'var(--doodle-green-pastel)', linkTextColorVar: 'var(--doodle-purple-soft)', },
  { id: '3', name: 'Adulto', description: 'Temas terapêuticos e artísticos', iconPath: '/imagens/sol.svg', bgColorVar: 'var(--doodle-pink-pastel)', linkTextColorVar: 'var(--doodle-blue-soft)', },
  { id: '4', name: 'Temáticos', description: 'Aventuras e histórias especiais', iconPath: '/imagens/star.svg', bgColorVar: 'var(--doodle-blue-sky)', linkTextColorVar: 'var(--doodle-yellow-mustard)', },
  { id: '5', name: 'Artigos Diversos', description: 'Materiais de arte e acessórios', iconPath: '/imagens/estrela2.svg', bgColorVar: 'var(--doodle-purple-light)', linkTextColorVar: 'var(--doodle-green-pastel)', },
];

// Variantes de animação do Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};


const CollectionsSection = () => {
  // Obtém a função para definir a categoria e navegar a partir do contexto
  const { setCategoryAndNavigate } = useFilter();

  return (
    <motion.section 
      className={styles.collectionsSection}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Anima uma vez quando 20% da seção está visível
    >
      <div className={styles.decorativeElements}>
         {/* Elementos decorativos podem ser adicionados aqui se necessário */}
      </div>

      <motion.h2 variants={itemVariants} className={styles.sectionTitle}>
        Nossas Coleções
      </motion.h2>
      <motion.p variants={itemVariants} className={styles.sectionSubtitle}>
        Encontre o livro perfeito para cada idade e interesse
      </motion.p>

      {/* O grid inteiro vai animar como um "item" */}
      <motion.div variants={itemVariants} className={styles.collectionsGrid}>
        {collectionData.map((collection, index) => (
          <motion.div
            key={collection.id}
            className={styles.collectionCard}
            style={{ backgroundColor: collection.bgColorVar }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.20)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className={styles.collectionIconContainer}>
              <Image
                src={collection.iconPath}
                alt={`${collection.name} Icon`}
                width={60}
                height={60}
                className={styles.collectionIcon}
              />
            </div>
            <h3 className={styles.collectionName}>{collection.name}</h3>
            <p className={styles.collectionDescription}>{collection.description}</p>
            {/* 
              O componente Link agora aponta diretamente para a página do catálogo.
              O evento onClick é usado para chamar a função do contexto, que irá
              atualizar o estado global do filtro e depois redirecionar a página.
            */}
            <Link 
              href="/catalog" 
              onClick={() => setCategoryAndNavigate(collection.id)}
              className={styles.viewCollectionLink} 
              style={{ color: collection.linkTextColorVar }}
            >
              Ver coleção
              <span className={styles.arrowIcon}>→</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default CollectionsSection;