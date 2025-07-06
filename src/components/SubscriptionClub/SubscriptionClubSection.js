'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import styles from './SubscriptionSection.module.css';

// Ícone de estrela da biblioteca react-icons/bs
// Certifique-se de ter 'react-icons' instalado
import { BsStarFill } from 'react-icons/bs'; // <-- Ícone alterado para estrela

// Registra o ScrollTrigger no GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SubscriptionSection = () => {
  const sectionRef = useRef(null);
  const imagePanelRef = useRef(null);
  const textPanelRef = useRef(null);
  const subheadingRef = useRef(null);
  const subheadingImaginationRef = useRef(null); // Ref para a palavra "imaginação" no subtítulo
  const titleRef = useRef(null); // Ref para o container do título <h2>
  const doodleDreamsTitleRef = useRef(null); // Nova Ref para a palavra "DoodleDreams" no título
  const descriptionRef = useRef(null);
  const benefitsRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    // REMOVIDO: Animação de entrada da imagem da esquerda com um pop sutil
    // REMOVIDO: Animação de flutuação sutil para a imagem dentro do painel

    // Animação de entrada do conteúdo do painel direito (subtítulo, título, descrição, benefícios, botão)
    // Nota: As animações de gradiente para as palavras específicas serão adicionadas separadamente
    const textElements = [
      subheadingRef.current, // O container do subtítulo
      titleRef.current, // O container do título <h2>
      descriptionRef.current,
      ...benefitsRef.current.filter(Boolean),
      buttonRef.current,
    ];

    gsap.fromTo(
      textElements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

     // Animação da palavra "imaginação" no subtítulo com degradê deslizante
     if (subheadingImaginationRef.current) {
        gsap.to(subheadingImaginationRef.current, {
            backgroundPosition: '100% 0',
            duration: 10,
            ease: "linear",
            repeat: -1,
            yoyo: true,
            // Começa após a animação de entrada do subtítulo ter um tempo
            delay: 1.5,
             scrollTrigger: {
                trigger: subheadingImaginationRef.current, // Gatilho na própria palavra
                start: "top 90%", // Começa quando a palavra entra na view
                toggleActions: "play none none none",
            },
        });
    }

    // Animação da palavra "DoodleDreams" no título com degradê deslizante
    if (doodleDreamsTitleRef.current) {
        gsap.to(doodleDreamsTitleRef.current, {
            backgroundPosition: '100% 0',
            duration: 10, // Mesma duração
            ease: "linear",
            repeat: -1,
            yoyo: true,
            delay: 1.8, // Pouco depois do subtítulo
            scrollTrigger: {
                trigger: doodleDreamsTitleRef.current, // Gatilho na própria palavra
                start: "top 90%", // Quando ela entra na view
                toggleActions: "play none none none",
            },
        });
    }


  }, []);

  // Itens de benefício melhorados
  const benefits = [
    'Livros de colorir temáticos e exclusivos',
    'Materiais de arte selecionados a dedo',
    'Surpresas criativas para inspirar',
    'Entrega mágica em todo o Brasil',
    'Flexibilidade: pause ou cancele quando quiser',
  ];

  return (
    <section ref={sectionRef} className={styles.subscriptionSection}>
      <div className={styles.subscriptionContent}>
        {/* Painel Esquerdo: Imagem Decorativa (sem animação de entrada/flutuação) */}
        <div ref={imagePanelRef} className={styles.imagePanel}>
          <Image
            src="/imagens/pinte-sonhos.jpg"
            alt="Pinte seus sonhos"
            width={400}
            height={400}
            priority
            className={styles.decorativeImage}
          />
        </div>

        {/* Painel Direito: Conteúdo do Clube de Assinatura */}
        <div ref={textPanelRef} className={styles.textPanel}>
          {/* Subtítulo com a palavra "imaginação" animada */}
          <p ref={subheadingRef} className={styles.sectionSubheading}>
            Entre em um mundo de cores e <span ref={subheadingImaginationRef} className={styles.subheadingImaginationWord}>imaginação</span>!
          </p>
          {/* Título com a palavra "DoodleDreams" animada */}
          <h2 ref={titleRef} className={styles.sectionTitle}>
            Clube de Assinatura <span ref={doodleDreamsTitleRef} className={styles.doodleDreamsTitleWord}>DoodleDreams</span>
          </h2>
          <p ref={descriptionRef} className={styles.sectionDescription}>
            Descubra a alegria de colorir com nossa caixa mensal mágica.
            Cada edição é uma surpresa cuidadosamente selecionada,
            repleta de livros inspiradores, materiais exclusivos e atividades
            criativas que acendem a centelha da imaginação em todas as idades.
          </p>

          <ul className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                ref={el => benefitsRef.current[index] = el}
                className={styles.benefitItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 + index * 0.15 }}
                >
                  {/* Ícone de estrela */}
                  <BsStarFill className={styles.benefitIcon} /> {/* <-- Classe renomeada e ícone alterado */}
                </motion.div>
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            ref={buttonRef}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(246, 197, 213, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={styles.buttonWrapper}
          >
            <Link href="/subscription-plans" className={styles.explorePlansButton}>
              Conhecer os Planos Mágicos
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;