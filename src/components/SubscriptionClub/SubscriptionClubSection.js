'use client';

import React, { useRef } from 'react'; // Removido useEffect
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
// import gsap from 'gsap'; // Removido GSAP
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'; // Removido ScrollTrigger

import styles from './SubscriptionSection.module.css';
import { BsStarFill } from 'react-icons/bs';

// Animação com Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Anima cada filho com um pequeno atraso
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};


const SubscriptionSection = () => {
  const benefits = [
    'Livros de colorir temáticos e exclusivos',
    'Materiais de arte selecionados a dedo',
    'Surpresas criativas para inspirar',
    'Entrega mágica em todo o Brasil',
    'Flexibilidade: pause ou cancele quando quiser',
  ];

  return (
    // Seção principal agora é um componente de movimento
    <motion.section 
      className={styles.subscriptionSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // A animação roda uma vez quando 30% está visível
      variants={containerVariants}
    >
      <div className={styles.subscriptionContent}>
        <motion.div className={styles.imagePanel} variants={itemVariants}>
          <Image
            src="/imagens/pinte-sonhos.jpg"
            alt="Pinte seus sonhos"
            width={400}
            height={400}
            priority
            className={styles.decorativeImage}
          />
        </motion.div>

        <div className={styles.textPanel}>
          <motion.p variants={itemVariants} className={styles.sectionSubheading}>
            Entre em um mundo de cores e <span className={styles.subheadingImaginationWord}>imaginação</span>!
          </motion.p>
          <motion.h2 variants={itemVariants} className={styles.sectionTitle}>
            Clube de Assinatura <span className={styles.doodleDreamsTitleWord}>DoodleDreams</span>
          </motion.h2>
          <motion.p variants={itemVariants} className={styles.sectionDescription}>
            Descubra a alegria de colorir com nossa caixa mensal mágica.
            Cada edição é uma surpresa cuidadosamente selecionada,
            repleta de livros inspiradores, materiais exclusivos e atividades
            criativas que acendem a centelha da imaginação em todas as idades.
          </motion.p>

          <ul className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                className={styles.benefitItem}
                variants={itemVariants} // Reutiliza a mesma variante de item
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 * index }}
                >
                  <BsStarFill className={styles.benefitIcon} />
                </motion.div>
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={itemVariants} className={styles.buttonWrapper}>
            <Link href="/subscription-plans" className={styles.explorePlansButton}>
              Conhecer os Planos Mágicos
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default SubscriptionSection;