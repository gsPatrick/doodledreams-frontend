'use client';

import React, { useRef, useEffect } from 'react';
import styles from './OpeningStatement.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const OpeningStatement = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const doodleDreamsWordRef = useRef(null); // Ref para o nome da marca no final

  useEffect(() => {
    // Animação de entrada das palavras da frase principal
    const words = textRef.current.querySelectorAll('span.word');
    gsap.fromTo(words,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.4)',
        stagger: 0.1, // Anima palavra por palavra
        delay: 0.3,
      }
    );

    // Animação para o nome da marca "DoodleDreams" no final
    gsap.fromTo(doodleDreamsWordRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.75)',
        delay: 1.5, // Aparece depois da frase principal
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none none',
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className={styles.statementSection}>
      <h1 ref={textRef} className={styles.statementText}>
        <span className="word">Todo</span>{' '}
        <span className={`${styles.highlight} word`}>sonho</span>{' '}
        <span className="word">começa</span>{' '}
        <span className="word">com</span>{' '}
        <span className="word">um</span>{' '}
        <span className="word">simples</span>{' '}
        <span className={`${styles.highlight} word`}>rabisco</span>.
      </h1>
      <h2 ref={doodleDreamsWordRef} className={styles.brandName}>
        Doodle Dreams
      </h2>
    </section>
  );
};

export default OpeningStatement;