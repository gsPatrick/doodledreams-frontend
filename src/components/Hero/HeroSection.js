'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import styles from './HeroSection.module.css';

// Registra o ScrollTrigger no GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const logoRef = useRef(null);
  const imaginationWordRef = useRef(null);

  useEffect(() => {
    // Animação de entrada geral da seção
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.inOut", delay: 0.5 }
    );

    // Animação de flutuação contínua da logo
    gsap.fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0, y: 50 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.7)",
        delay: 0.8,
        onComplete: () => {
          gsap.to(logoRef.current, {
            y: "random(-10, 10)",
            x: "random(-5, 5)",
            rotation: "random(-2, 2)",
            duration: "random(4, 7)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      }
    );

    // Animação do título (palavra por palavra)
    const titleWords = titleRef.current.children;
    gsap.fromTo(
      titleWords,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        delay: 1.2,
      }
    );

    // Animação da descrição
    gsap.fromTo(
      descriptionRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 1.6 }
    );

    // Animação dos botões
    gsap.fromTo(
      buttonsRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.15, delay: 1.8 }
    );

    // Animação da palavra "Imaginação" com degradê deslizante
    if (imaginationWordRef.current) {
      gsap.to(imaginationWordRef.current, {
        backgroundPosition: '100% 0',
        duration: 10,
        ease: "linear",
        repeat: -1,
        yoyo: true,
      });
    }

  }, []);

  // Estrutura do título ajustada para "Imaginação" ficar em uma linha própria.
  const titleParts = [
    { text: "Livros", isWord: true },
    { text: "que", isWord: true },
    { text: null, isBreak: true },
    { text: "despertam", isWord: true },
    { text: "a", isWord: true },
    { text: null, isBreak: true },
    { text: "sua", isWord: true },
    { text: null, isBreak: true },
    { text: "Imaginação", isWord: true, isAnimated: true },
  ];

  const titleElements = titleParts.map((part, index) => {
    if (part.isBreak) {
      return <br key={`break-${index}`} className={styles.titleLineBreak} />;
    } else if (part.isAnimated) {
      return (
        <span key={index} ref={imaginationWordRef} className={styles.imaginationWord}>
          {part.text}
        </span>
      );
    } else if (part.isWord) {
      return (
        <span key={index} className={styles.titleWord}>
          {part.text}
        </span>
      );
    }
    return null;
  });


  return (
    <section ref={sectionRef} className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.heroImageContainer}>
          <Image
            ref={logoRef}
            src="/imagens/logo.svg"
            alt="Doodle Dreams Logo"
            width={600}
            height={600}
            priority
            className={styles.heroImage}
          />
        </div>

        <div className={styles.heroTextContainer}>
          <h1 ref={titleRef} className={styles.heroTitle}>
            {titleElements}
          </h1>
          <p ref={descriptionRef} className={styles.heroDescription}>
            Descubra histórias mágicas e ilustrações encantadoras para todas as idades. Nossos livros são cuidadosamente criados para inspirar, educar e encantar.
          </p>
          <div ref={buttonsRef} className={styles.heroButtons}>
            <motion.div
              className={styles.buttonWrapper}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(144, 122, 204, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/catalog" className={styles.primaryButton}>
                Explorar Catálogo
              </Link>
            </motion.div>
            <motion.div
              className={styles.buttonWrapper}
              whileHover={{ scale: 1.03, boxShadow: "0 4px 8px rgba(122, 151, 204, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/subscription" className={styles.secondaryButton}>
                Conheça nossa Assinatura
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;