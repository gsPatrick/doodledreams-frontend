'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Header.module.css'; // Reutiliza os estilos do Header

// Ícones
import { HiXMark } from 'react-icons/hi2'; // Ícone de fechar
import { BsSearch, BsPerson, BsHeart, BsCart, BsPhone, BsEnvelope } from 'react-icons/bs';
import { BsTiktok } from 'react-icons/bs';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { HiChevronRight } from 'react-icons/hi';

const OffCanvasMenu = ({ isOpen, onClose }) => {
  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: '0%', transition: { type: 'tween', ease: 'easeOut', duration: 0.3 } },
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catálogo', href: '/catalog', hasSubMenu: true, subMenu: [
        { name: 'Adulto', href: '/category/adulto' },
        { name: 'Infantil', href: '/category/infantil' },
        { name: 'Juvenil', href: '/category/juvenil' },
        { name: 'Mais Vendidos', href: '/featured/mais-vendidos' },
        { name: 'Lançamentos', href: '/featured/lancamentos' },
    ]},
    { name: 'Assinatura', href: '/subscription' },
    { name: 'Sobre Nós', href: '/about' },
    { name: 'Contato', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Downloads Grátis', href: '/downloads' },
  ];

  return (
    <>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      <motion.div
        className={styles.offCanvasMenu}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={menuVariants}
      >
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Menu</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar Menu">
            <HiXMark />
          </button>
        </div>

        <div className={styles.menuContent}>
          {/* Links de Navegação */}
          <nav>
            <ul className={styles.menuNavList}>
              {navLinks.map((link) => (
                <li key={link.name} className={styles.menuNavItem}>
                  <Link href={link.href} className={styles.menuNavLink} onClick={onClose}>
                    {link.name}
                    {link.hasSubMenu && <HiChevronRight className={styles.menuSubMenuIcon} />}
                  </Link>
                  {/* Se tiver sub-menu, você pode adicionar a lógica para exibi-lo aqui */}
                </li>
              ))}
            </ul>
          </nav>

          {/* Links de Ação (Minha Conta, Favoritos, Busca) */}
          <div className={styles.menuActionLinks}>
            <Link href="/my-account" className={styles.menuActionLink} onClick={onClose}>
              <BsPerson className={styles.menuActionIcon} /> Minha Conta
            </Link>
            <Link href="/favorites" className={styles.menuActionLink} onClick={onClose}>
              <BsHeart className={styles.menuActionIcon} /> Favoritos
            </Link>
            <div className={styles.menuSearchContainer}>
              <input
                type="text"
                placeholder="Buscar..."
                className={styles.menuSearchInput}
              />
              <button className={styles.menuSearchButton} aria-label="Buscar">
                <BsSearch />
              </button>
            </div>
          </div>

          {/* Contato e Redes Sociais */}
          <div className={styles.menuContactInfo}>
            <a href="tel:+5511954728628" className={styles.menuContactLink}>
              <BsPhone className={styles.menuContactIcon} /> (11) 95472-8628
            </a>
            <a href="mailto:contato@doodledreams.com.br" className={styles.menuContactLink}>
              <BsEnvelope className={styles.menuContactIcon} /> contato@doodledreams.com.br
            </a>
            <div className={styles.menuSocialLinks}>
              <a href="#" className={styles.menuSocialLink} aria-label="TikTok"><BsTiktok /></a>
              <a href="#" className={styles.menuSocialLink} aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className={styles.menuSocialLink} aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default OffCanvasMenu;