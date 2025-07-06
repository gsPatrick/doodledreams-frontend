'use client';

import React, { useRef, useEffect } from 'react';
import styles from './ContactPage.module.css';
import gsap from 'gsap';

const ContactHero = () => {
  const titleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Animação de entrada do título e texto
    gsap.fromTo(
      [titleRef.current, textRef.current],
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2,
        delay: 0.3,
      }
    );
  }, []);

  return (
    <div className={styles.heroContainer}>
      <h1 ref={titleRef} className={styles.heroTitle}>
        Onde os <span className={styles.highlight}>Sonhos</span> Encontram os <span className={styles.highlight}>Rabiscos</span>.
      </h1>
      <p ref={textRef} className={styles.heroText}>
        Cada história começa com uma conversa, cada obra de arte com um traço.
        Estamos aqui para ouvir a sua. Seja uma dúvida, uma ideia brilhante ou
        apenas um "olá" colorido, sua mensagem é a próxima página da nossa jornada.
      </p>
    </div>
  );
};

export default ContactHero;