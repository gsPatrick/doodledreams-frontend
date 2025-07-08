'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import styles from './Footer.module.css';
import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Footer = () => {
  const footerRef = useRef(null);
  
  // CORREÇÃO: Usando gsap.context para um gerenciamento seguro das animações.
  useEffect(() => {
    // Cria um contexto GSAP para encapsular as animações
    const ctx = gsap.context(() => {
      // Animação de entrada do footer inteiro quando ele entra na viewport
      gsap.fromTo(
        footerRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Animação escalonada para as colunas do footer
      gsap.fromTo(
        ".footer-column-animate", // Usa uma classe para selecionar as colunas
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef); // Escopo do contexto para o elemento principal do footer

    // Função de limpeza: reverte todas as animações dentro do contexto quando o componente é desmontado
    return () => ctx.revert(); 
  }, []); // O array de dependências vazio garante que isso rode apenas uma vez

  return (
    <footer ref={footerRef} className={styles.footerContainer}>
      <div className={styles.wavySeparator}>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={styles.wavyFill}></path>
        </svg>
      </div>

      <div className={styles.footerContent}>
        {/* CORREÇÃO: Adicionada classe para animação */}
        <div className={`${styles.footerColumn} footer-column-animate`}>
          <Link href="/" className={styles.footerLogo}>
            <Image src="/imagens/logo.svg" alt="DoodleDreams Logo" width={180} height={180} className={styles.logoImage} />
          </Link>
          <p className={styles.footerDescription}>
            Livros ilustrados e educativos que inspiram a imaginação e o aprendizado para todas as idades. Nossa missão é criar experiências literárias mágicas e acolhedoras.
          </p>
          <div className={styles.socialIcons}>
            <motion.a href="#" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -3 }}><FaFacebookF /></motion.a>
            <motion.a href="#" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -3 }}><FaInstagram /></motion.a>
            <motion.a href="#" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -3 }}><FaPinterestP /></motion.a>
            <motion.a href="#" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -3 }}><FaTwitter /></motion.a>
          </div>
        </div>

        <div className={`${styles.footerColumn} footer-column-animate`}>
          <h3 className={styles.footerTitle}>Navegação</h3>
          <ul className={styles.footerList}>
            <li><Link href="/" className={styles.footerLink}>Home</Link></li>
            <li><Link href="/catalog" className={styles.footerLink}>Catálogo</Link></li>
            <li><Link href="/subscription" className={styles.footerLink}>Assinatura</Link></li>
            <li><Link href="/about" className={styles.footerLink}>Sobre Nós</Link></li>
            <li><Link href="/contact" className={styles.footerLink}>Contato</Link></li>
          </ul>
        </div>

        <div className={`${styles.footerColumn} footer-column-animate`}>
          <h3 className={styles.footerTitle}>Categorias</h3>
          <ul className={styles.footerList}>
            <li><Link href="/category/infantil" className={styles.footerLink}>Infantil</Link></li>
            <li><Link href="/category/juvenil" className={styles.footerLink}>Juvenil</Link></li>
            <li><Link href="/category/adulto" className={styles.footerLink}>Adulto</Link></li>
            <li><Link href="/category/mais-vendidos" className={styles.footerLink}>Mais Vendidos</Link></li>
            <li><Link href="/category/lancamentos" className={styles.footerLink}>Lançamentos</Link></li>
          </ul>
        </div>

        <div className={`${styles.footerColumn} footer-column-animate`}>
          <h3 className={styles.footerTitle}>Ajuda</h3>
          <ul className={styles.footerList}>
            <li><Link href="/how-to-buy" className={styles.footerLink}>Como Comprar</Link></li>
            <li><Link href="/payment" className={styles.footerLink}>Pagamento</Link></li>
            <li><Link href="/shipping" className={styles.footerLink}>Envio</Link></li>
            <li><Link href="/returns" className={styles.footerLink}>Trocas e Devoluções</Link></li>
            <li><Link href="/faq" className={styles.footerLink}>FAQ</Link></li>
          </ul>
          
          <h3 className={`${styles.footerTitle} ${styles.marginTop}`}>Contato</h3>
          <ul className={styles.footerList}>
            <li className={styles.contactItem}><FaPhoneAlt /><span>(11) 95472-8628</span></li>
            <li className={styles.contactItem}><FaEnvelope /><span>contato@doodledreams.com.br</span></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottomBar}>
        <span>© {new Date().getFullYear()} DoodleDreams. Todos os direitos reservados.</span>
        <span className={styles.developerCredit}>
          Desenvolvido por <a href="https://codebypatrick.dev" target="_blank" rel="noopener noreferrer">Patrick.Developer</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;