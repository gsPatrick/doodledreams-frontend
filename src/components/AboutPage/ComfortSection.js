'use client'; // <-- ADICIONE ESTA LINHA NO TOPO DO ARQUIVO

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ComfortSection.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ComfortSection = () => {
  const sectionRef = useRef(null);
  const textContentRef = useRef(null);
  const imageWrapperRef = useRef(null);

  useEffect(() => {
    // Animação de entrada do texto
    const title = textContentRef.current.querySelector('h2');
    const paragraph = textContentRef.current.querySelector('p');
    gsap.fromTo(
      [title, paragraph],
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Animação de entrada da imagem do livro (vindo da direita)
    gsap.fromTo(
      imageWrapperRef.current,
      { scale: 0.8, opacity: 0, rotationY: 90, x: 100 },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        x: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Efeito de Parallax na imagem ao rolar
    gsap.to(imageWrapperRef.current, {
      y: -50, // Move a imagem para cima mais devagar que o scroll
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom', // Começa quando o topo da seção atinge a base da tela
        end: 'bottom top',   // Termina quando a base da seção atinge o topo da tela
        scrub: true,
      },
    });

  }, []);

  return (
    <section ref={sectionRef} className={styles.comfortSection}>
      <div className={styles.comfortContent}>
        {/* Painel Esquerdo: Texto */}
        <div ref={textContentRef} className={styles.leftPanel}>
          <h2 className={styles.sectionTitle}>
            Onde Transformamos a <span className={styles.highlight}>tristeza</span> em cor.
          </h2>
          <p className={styles.sectionSubtitle}>
            Na DoodleDreams, entendemos que todos os sentimentos são importantes. Nossos livros, como "Tristeza Vai Embora", são ferramentas gentis para ajudar crianças (e adultos!) a navegar por emoções complexas. Acreditamos que, ao dar cor à tristeza, podemos compreendê-la e encontrar o caminho de volta para o sol.
          </p>
        </div>

        {/* Painel Direito: Imagem e Elementos Decorativos */}
        <div className={styles.rightPanel}>
          <div ref={imageWrapperRef} className={styles.imageWrapper}>
            <Image
              src="/imagens/tristezavaiembora.png"
              alt="Livro de colorir Tristeza Vai Embora da Doodle Dreams"
              width={500}
              height={500}
              className={styles.bookImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComfortSection;