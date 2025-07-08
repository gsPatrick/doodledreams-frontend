'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; 

// React Icons
import { BsPhone, BsEnvelope, BsSearch, BsPerson, BsPersonFill, BsHeart, BsCart, BsTiktok, BsBoxArrowRight } from 'react-icons/bs';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { HiOutlineBars3, HiXMark, HiChevronDown, HiChevronRight } from 'react-icons/hi2';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Header = () => {
  const headerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogDropdownOpen, setIsCatalogDropdownOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    document.body.style.overflowY = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflowY = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const mainBar = headerRef.current.querySelector(`.${styles.mainBar}`);
    const navBar = headerRef.current.querySelector(`.${styles.navBar}`);

    const applyScrollEffect = () => {
      if (window.innerWidth >= 768) {
        gsap.to([mainBar, navBar], {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.15)',
          ease: 'power1.out',
          duration: 0.3,
          scrollTrigger: {
            trigger: "body",
            start: "top -=10",
            end: "top -=11",
            scrub: true,
          },
        });
      } else {
        ScrollTrigger.getAll().forEach(st => st.kill());
        gsap.set([mainBar, navBar], { clearProps: "all" });
      }
    };
    
    gsap.fromTo(headerRef.current, { y: -200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 });
    applyScrollEffect();
    window.addEventListener('resize', applyScrollEffect);
    return () => {
      window.removeEventListener('resize', applyScrollEffect);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const toggleCatalogDropdown = () => {
    setIsCatalogDropdownOpen(!isCatalogDropdownOpen);
  };
  
  const desktopNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catálogo', href: '/catalog', hasDropdown: true, dropdownContent: (
        <div className={styles.catalogDropdown}>
          <div className={styles.dropdownColumn}>
            <h4 className={styles.dropdownColumnTitle}>Por Categoria</h4>
            <ul>
              <li><Link href="/catalog?category=adulto" className={styles.dropdownLink}>Adulto</Link></li>
              <li><Link href="/catalog?category=infantil" className={styles.dropdownLink}>Infantil</Link></li>
              <li><Link href="/catalog?category=juvenil" className={styles.dropdownLink}>Juvenil</Link></li>
              <li><Link href="/catalog?category=tematico" className={styles.dropdownLink}>Temáticos</Link></li>
              <li><Link href="/catalog?category=artigosDiversos" className={styles.dropdownLink}>Artigos Diversos</Link></li>
            </ul>
          </div>
          <div className={styles.dropdownColumn}>
            <h4 className={styles.dropdownColumnTitle}>Destaques</h4>
            <ul>
              <li><Link href="/catalog?sort=mais-vendidos" className={styles.dropdownLink}>Mais Vendidos</Link></li>
              <li><Link href="/catalog?sort=lancamentos" className={styles.dropdownLink}>Lançamentos</Link></li>
            </ul>
          </div>
        </div>
      )
    },
    { name: 'Assinatura', href: '/subscription' },
    { name: 'Sobre Nós', href: '/about' },
  ];
  
  const mobileNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catálogo', href: '/catalog' },
    { name: 'Assinatura', href: '/subscription' },
    { name: 'Sobre Nós', href: '/about' },
  ];

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <div className={styles.topBarWrapper}>
            <div className={styles.topBar}>
                <div className={styles.topBarContent}>
                    <div className={styles.topBarContact}>
                        <a href="tel:+5511954728628" className={styles.topBarLink}><BsPhone className={styles.topBarIcon} /><span>(11) 95472-8628</span></a>
                        <a href="mailto:contato@doodledreams.com.br" className={styles.topBarLink}><BsEnvelope className={styles.topBarIcon} /><span>contato@doodledreams.com.br</span></a>
                    </div>
                    <div className={styles.topBarSocial}>
                        <a href="#" className={styles.topBarSocialLink} aria-label="TikTok"><BsTiktok /></a>
                        <a href="#" className={styles.topBarSocialLink} aria-label="Facebook"><FaFacebookF /></a>
                        <a href="#" className={styles.topBarSocialLink} aria-label="Instagram"><FaInstagram /></a>
                    </div>
                </div>
            </div>
        </div>

        <div className={styles.mainBar}>
          <div className={styles.mainBarContent}>
            <Link href="/" className={styles.mainLogo}><span>Doodle Dreams</span></Link>
            <div className={styles.searchContainer}>
                <input type="text" placeholder="Buscar livros, coleções..." className={styles.searchInput} />
                <button className={styles.searchButton} aria-label="Buscar"><BsSearch className={styles.searchIcon} /></button>
            </div>
            <div className={styles.mainActionIcons}>
              {/* CORREÇÃO: Links de conta e favoritos agora escondidos em mobile */ }
              <Link href={isAuthenticated ? "/my-account" : "/auth"} className={`${styles.mainActionLink} ${styles.hideOnMobile} ${isAuthenticated ? styles.loggedInUser : ''}`}>
                {isAuthenticated ? <BsPersonFill className={styles.mainIcon} /> : <BsPerson className={styles.mainIcon} />}
                <span>{isAuthenticated ? `Olá, ${user.nome.split(' ')[0]}` : 'Entrar'}</span>
              </Link>
              
              {isAuthenticated && (
                <button onClick={logout} className={`${styles.mainActionLink} ${styles.hideOnMobile} ${styles.logoutButton}`}>
                  <BsBoxArrowRight className={styles.mainIcon} />
                  <span>Sair</span>
                </button>
              )}
              
              
              {/* Carrinho permanece visível em todas as telas */}
              <Link href="/cart" className={styles.mainActionLink}>
                <div className={styles.cartIconWrapper}>
                  <BsCart className={styles.mainIcon} />
                  {totalItemsInCart > 0 && (
                    <span className={styles.cartBadge}>{totalItemsInCart}</span>
                  )}
                </div>
                {/* O texto "Carrinho" será escondido via CSS no mobile */}
                <span>Carrinho</span>
              </Link>
              
              <button className={styles.mobileMenuButton} aria-label="Abrir Menu" onClick={() => setIsMenuOpen(true)}><HiOutlineBars3 className={styles.hamburgerIcon} /></button>
            </div>
          </div>
        </div>

        <div className={styles.navBar}>
          <div className={styles.navBarContent}>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {desktopNavLinks.map((link) => (
                        <li key={link.name} className={styles.navItem}>
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={styles.navItemWrapper}>
                                <Link href={link.href} className={styles.navLink} onClick={link.hasDropdown ? (e) => { e.preventDefault(); toggleCatalogDropdown(); } : undefined}>
                                    {link.name}
                                    {link.hasDropdown && (<HiChevronDown className={`${styles.navLinkDropdownIcon} ${isCatalogDropdownOpen ? styles.rotated : ''}`} />)}
                                </Link>
                                <span className={styles.navLinkUnderline}></span>
                            </motion.div>
                            {link.hasDropdown && isCatalogDropdownOpen && link.dropdownContent}
                        </li>
                    ))}
                </ul>
            </nav>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} />
            <motion.div className={styles.offCanvasMenu} initial={{ x: '100%' }} animate={{ x: '0%' }} exit={{ x: '100%' }} transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}>
              <div className={styles.menuHeader}>
                <span className={styles.menuTitle}>Menu</span>
                <button className={styles.closeButton} onClick={() => setIsMenuOpen(false)} aria-label="Fechar Menu"><HiXMark /></button>
              </div>
              <div className={styles.menuContent}>
                <nav>
                    <ul className={styles.menuNavList}>
                        {mobileNavLinks.map((link) => (
                            <li key={link.name} className={styles.menuNavItem}>
                                <Link href={link.href} className={styles.menuNavLink} onClick={() => setIsMenuOpen(false)}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* CORREÇÃO: Links de Conta e Sair adicionados aqui dentro do menu */ }
                <div className={styles.menuActionLinks}>
                  <Link href={isAuthenticated ? "/my-account" : "/auth"} className={styles.menuActionLink} onClick={() => setIsMenuOpen(false)}>
                    {isAuthenticated ? <BsPersonFill className={styles.menuActionIcon} /> : <BsPerson className={styles.menuActionIcon} />}
                    {isAuthenticated ? `Minha Conta` : 'Entrar / Cadastrar'}
                  </Link>
                  
                  {isAuthenticated && (
                     <button onClick={() => { logout(); setIsMenuOpen(false); }} className={styles.menuActionLink}>
                       <BsBoxArrowRight className={styles.menuActionIcon} />
                       Sair
                     </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;