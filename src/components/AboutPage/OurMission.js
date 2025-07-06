'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './OurMission.module.css';
import { BsPalette, BsHeart, BsLightbulb, BsBook } from 'react-icons/bs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const missionData = [
  {
    icon: <BsPalette />,
    title: (
      <>Inspirar a <span className={styles.highlightWord}>Criatividade</span></>
    ),
    description: "Acreditamos que cada pessoa tem um artista interior esperando para ser descoberto.",
  },
  {
    icon: <BsHeart />,
    title: (
      <>Conectar <span className={styles.highlightWord}>Famílias</span></>
    ),
    description: "Nossos livros são convites para momentos de qualidade, unindo gerações através da arte.",
  },
  {
    icon: <BsLightbulb />,
    title: (
      <>Despertar a <span className={styles.highlightWord}>Imaginação</span></>
    ),
    description: "Criamos mundos onde a única regra é sonhar e explorar o impossível.",
  },
  {
    icon: <BsBook />,
    title: (
      <>Amor pela <span className={styles.highlightWord}>Leitura</span></>
    ),
    description: "Mais do que colorir, fomentamos a paixão por histórias e o poder que elas têm.",
  },
];

const OurMission = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Animação para "pintar" as palavras destacadas
    const highlightWords = sectionRef.current.querySelectorAll(`.${styles.highlightWord}`);
    highlightWords.forEach(word => {
      gsap.to(word, {
        backgroundSize: '100% 100%',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: word,
          start: 'top 85%',
          duration: 1.5,
          toggleActions: 'play none none none',
        },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.missionSection}>
      <h2 className={styles.sectionTitle}>Nossa Missão Mágica</h2>
      <div className={styles.missionGrid}>
        {missionData.map((item, index) => (
          <motion.div
            key={index}
            className={styles.missionCard}
            initial={{ opacity: 0, y: 50, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
            whileHover={{ scale: 1.05, y: -10, boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.1)" }}
          >
            <div className={styles.iconWrapper}>{item.icon}</div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDescription}>{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurMission;