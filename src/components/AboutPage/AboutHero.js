'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './AboutHero.module.css';
import gsap from 'gsap';

// Ícones para os elementos decorativos animados
import { FaHeart, FaStar, FaPaintBrush } from 'react-icons/fa';

const AboutHero = () => {
  const heroRef = useRef(null);
  const textContentRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const decorativeElementsRef = useRef([]);

  useEffect(() => {
    // Animação de entrada do texto
    const title = textContentRef.current.querySelector('h1');
    const paragraph = textContentRef.current.querySelector('p');
    gsap.fromTo(
      [title, paragraph],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2, delay: 0.3 }
    );

    // Animação de entrada da imagem do livro
    gsap.fromTo(
      imageWrapperRef.current,
      { scale: 0.8, opacity: 0, rotationY: -90, x: -100 },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        x: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.7)',
        delay: 0.5,
      }
    );

    // Animação dos ícones decorativos "saindo" do livro
    gsap.fromTo(
      decorativeElementsRef.current,
      { scale: 0, opacity: 0, x: 0, y: 0, rotate: 'random(-180, 180)' },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        delay: 1.2,
        onComplete: () => {
          // Animação de flutuação contínua após a entrada
          decorativeElementsRef.current.forEach(el => {
            if (el) {
              gsap.to(el, {
                y: '+=random(-15, 15)',
                x: '+=random(-10, 10)',
                rotation: '+=random(-10, 10)',
                duration: 'random(3, 6)',
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              });
            }
          });
        }
      }
    );
  }, []);

  return (
    <section ref={heroRef} className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* Painel Esquerdo: Imagem e Elementos Decorativos */}
        <div className={styles.leftPanel}>
          <div ref={imageWrapperRef} className={styles.imageWrapper}>
            <Image
              src="/imagens/amigos.png"
              alt="Livro de colorir Amigos para Sempre da Doodle Dreams"
              width={500}
              height={500}
              priority
              className={styles.bookImage}
            />
          </div>
          {/* Elementos decorativos que "saem" do livro */}
          <div
            ref={el => decorativeElementsRef.current[0] = el}
            className={`${styles.decorativeIcon} ${styles.heartIcon}`}
          >
            <FaHeart />
          </div>
          <div
            ref={el => decorativeElementsRef.current[1] = el}
            className={`${styles.decorativeIcon} ${styles.starIcon}`}
          >
            <FaStar />
          </div>
          <div
            ref={el => decorativeElementsRef.current[2] = el}
            className={`${styles.decorativeIcon} ${styles.brushIcon}`}
          >
            <FaPaintBrush />
          </div>
        </div>

        {/* Painel Direito: Texto */}
        <div ref={textContentRef} className={styles.rightPanel}>
          <h1 className={styles.heroTitle}>
            Onde cada página é um <span className={styles.highlight}>sonho</span> colorido.
          </h1>
          <p className={styles.heroSubtitle}>
            Bem-vindo à Doodle Dreams! Nascemos da paixão por contar histórias e da crença de que a criatividade é uma porta para a felicidade. Nossa missão é criar mais do que livros: criamos portais para a imaginação, onde crianças e adultos podem se expressar, relaxar e se conectar através da magia das cores.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;