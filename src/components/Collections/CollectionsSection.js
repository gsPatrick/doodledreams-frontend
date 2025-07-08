'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import styles from './CollectionsSection.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const collectionData = [
  { id: 'infantil', name: 'Infantil', description: '3 a 8 anos', iconPath: '/imagens/lapisduplo.svg', bgColorVar: 'var(--doodle-yellow-light)', linkTextColorVar: 'var(--doodle-blue-soft)', },
  { id: 'juvenil', name: 'Juvenil', description: '9 a 14 anos', iconPath: '/imagens/arcoiris.svg', bgColorVar: 'var(--doodle-green-pastel)', linkTextColorVar: 'var(--doodle-purple-soft)', },
  { id: 'adulto', name: 'Adulto', description: 'Temas terapêuticos e artísticos', iconPath: '/imagens/sol.svg', bgColorVar: 'var(--doodle-pink-pastel)', linkTextColorVar: 'var(--doodle-blue-soft)', },
  { id: 'tematico', name: 'Temáticos', description: 'Aventuras e histórias especiais', iconPath: '/imagens/star.svg', bgColorVar: 'var(--doodle-blue-sky)', linkTextColorVar: 'var(--doodle-yellow-mustard)', },
  { id: 'artigosDiversos', name: 'Artigos Diversos', description: 'Materiais de arte e acessórios', iconPath: '/imagens/estrela2.svg', bgColorVar: 'var(--doodle-purple-light)', linkTextColorVar: 'var(--doodle-green-pastel)', },
];

const CollectionsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [titleRef.current, subtitleRef.current],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            // CORREÇÃO: Ponto de início mais baixo para garantir que funcione no mobile
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".collection-card-animate", 
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.7)",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            // CORREÇÃO: Ponto de início mais baixo também para os cards
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.to(`.${styles.decorativeElement}`, {
        y: "random(-20, 20)",
        x: "random(-15, 15)",
        rotation: "random(-10, 10)",
        scale: "random(0.9, 1.1)",
        duration: "random(4, 8)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.8, from: "random", repeat: -1, yoyo: true },
        delay: "random(0, 2)",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.collectionsSection}>
      <div className={styles.decorativeElements}>
         {/* ...elementos decorativos... */}
      </div>

      <h2 ref={titleRef} className={styles.sectionTitle}>Nossas Coleções</h2>
      <p ref={subtitleRef} className={styles.sectionSubtitle}>Encontre o livro perfeito para cada idade e interesse</p>

      <div className={styles.collectionsGrid}>
        {collectionData.map((collection) => (
          <motion.div
            key={collection.id}
            className={`${styles.collectionCard} collection-card-animate`}
            style={{ backgroundColor: collection.bgColorVar }}
            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.20)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className={styles.collectionIconContainer}>
              <Image src={collection.iconPath} alt={`${collection.name} Icon`} width={60} height={60} className={styles.collectionIcon} />
            </div>
            <h3 className={styles.collectionName}>{collection.name}</h3>
            <p className={styles.collectionDescription}>{collection.description}</p>
            <Link href={`/catalog?category=${collection.id}`} className={styles.viewCollectionLink} style={{ color: collection.linkTextColorVar }}>
              Ver coleção
              <span className={styles.arrowIcon}>→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;