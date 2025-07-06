'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import styles from './LatestProductsSection.module.css';
import ProductCard from '@/components/ProductCard/ProductCard';
import api from '@/services/api';

// Registra o ScrollTrigger no GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LatestProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await api.get('/produtos/lancamentos?limit=5');
        
        const formattedProducts = response.data.map(p => ({
          id: p.id,
          name: p.nome,
          price: p.variacoes.length > 0 ? p.variacoes[0].preco : 0,
          imagePath: p.imagens.length > 0 ? p.imagens[0] : 'https://placehold.co/400x500.png',
          isNew: true,
          buttonColor: 'blue',
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Erro ao buscar lançamentos:", err);
        setError("Não foi possível carregar os lançamentos no momento.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  useEffect(() => {
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
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    const decorativeElements = sectionRef.current.querySelectorAll(`.${styles.decorativeElement}`);
    gsap.to(decorativeElements, {
      y: "random(-20, 20)",
      x: "random(-15, 15)",
      rotation: "random(-10, 10)",
      scale: "random(0.9, 1.1)",
      duration: "random(4, 8)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.8,
        from: "random",
        repeat: -1,
        yoyo: true,
      },
      delay: "random(0, 2)",
    });
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <p className={styles.loadingText}>Carregando rabiscos...</p>;
    }

    if (error) {
      return <p className={styles.errorText}>{error}</p>;
    }

    if (products.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          <h3 className={styles.emptyMessage}>
            Todo <span className={styles.highlight}>sonho</span> começa com um simples <span className={styles.highlight}>rabisco</span>.
          </h3>
          <p className={styles.emptySubMessage}>
            Novas criações mágicas chegarão em breve!
          </p>
        </div>
      );
    }

    return (
      <div className={styles.productsGridWrapper}>
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className={styles.latestProductsSection}>
      <div className={styles.decorativeElementsContainer}>
        <Image src="/imagens/star.svg" alt="Estrela decorativa" width={50} height={50} className={`${styles.decorativeElement} ${styles.starTopLeft}`} />
        <Image src="/imagens/arcoiris.svg" alt="Espiral decorativa" width={40} height={40} className={`${styles.decorativeElement} ${styles.spiralTopRight}`} />
        <Image src="/imagens/borboletaroxa.svg" alt="Diamante decorativo" width={30} height={30} className={`${styles.decorativeElement} ${styles.diamondBottomLeft}`} />
        <Image src="/imagens/estrela2.svg" alt="Brilho decorativo" width={25} height={25} className={`${styles.decorativeElement} ${styles.sparkleBottomRight}`} />
        <Image src="/imagens/sol.svg" alt="Coração decorativo" width={40} height={40} className={`${styles.decorativeElement} ${styles.heartCenter}`} />
      </div>

      <h2 ref={titleRef} className={styles.sectionTitle}>
        Últimos Lançamentos
      </h2>
      <p ref={subtitleRef} className={styles.sectionSubtitle}>
        Descubra as novidades mais recentes do universo DoodleDreams!
      </p>

      {renderContent()}
    </section>
  );
};

export default LatestProductsSection;