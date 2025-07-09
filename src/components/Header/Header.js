// src/components/Header/Header.js

'use client';

// Adicionar useState, useEffect, useRef para a nova funcionalidade
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useFilter } from '@/context/FilterContext';
import api from '@/services/api';

// React Icons
import { BsPhone, BsEnvelope, BsSearch, BsPerson, BsPersonFill, BsCart, BsTiktok, BsBoxArrowRight } from 'react-icons/bs';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { HiOutlineBars3, HiXMark, HiChevronDown } from 'react-icons/hi2';


const Header = () => {
  const headerRef = useRef(null);
  const searchContainerRef = useRef(null); // Ref para o container da busca

  // Estados do Menu Principal e Dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogDropdownOpen, setIsCatalogDropdownOpen] = useState(false);
  const [apiCategories, setApiCategories] = useState([]);

  // --- ALTERAÇÃO: Estados para a funcionalidade de busca ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Controla visibilidade do dropdown

  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const { setCategoryAndNavigate, clearAllFilters } = useFilter();
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  // --- ALTERAÇÃO: Lógica de busca com Debounce ---
  useEffect(() => {
    // Se não há termo de busca, limpa os resultados e para
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    // Define um temporizador para aguardar o usuário parar de digitar
    const debounceTimer = setTimeout(() => {
      const fetchResults = async () => {
        setIsSearchLoading(true);
        try {
          // Busca na API com o termo e um limite de resultados
          const response = await api.get('/produtos', {
            params: {
              busca: searchTerm,
              limit: 5, // Limita a 5 resultados para o dropdown
            },
          });
          setSearchResults(response.data.produtos);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          setSearchResults([]);
        } finally {
          setIsSearchLoading(false);
        }
      };
      fetchResults();
    }, 300); // Aguarda 300ms após a última digitação

    // Limpa o temporizador se o usuário digitar novamente
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
  
  // --- ALTERAÇÃO: Efeito para fechar o dropdown ao clicar fora ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    // Adiciona o listener
    document.addEventListener("mousedown", handleClickOutside);
    // Remove o listener ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categorias');
        const activeCategories = response.data.filter(cat => cat.ativo !== false);
        setApiCategories(activeCategories);
      } catch (error) {
        console.error("Erro ao buscar categorias para o Header:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setCategoryAndNavigate(String(categoryId));
    setIsCatalogDropdownOpen(false);
  };
  
  const handleViewAllClick = () => {
    clearAllFilters();
    setIsCatalogDropdownOpen(false);
  };
  
  const handleResultClick = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  useEffect(() => {
    document.body.style.overflowY = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflowY = 'unset';
    };
  }, [isMenuOpen]);

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
              <li>
                <Link href="/catalog" onClick={handleViewAllClick} className={`${styles.dropdownLink} ${styles.viewAllLink}`}>
                  Ver Todos
                </Link>
              </li>
              {apiCategories.map(category => (
                <li key={category.id}>
                  <Link href="/catalog" onClick={() => handleCategoryClick(category.id)} className={styles.dropdownLink}>
                    {category.nome}
                  </Link>
                </li>
              ))}
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
    {name: 'Contato', href: '/contact'}
  ];
  
  const mobileNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catálogo', href: '/catalog' },
    { name: 'Assinatura', href: '/subscription' },
    { name: 'Sobre Nós', href: '/about' },
    {name: 'Contato', href: '/contact'}
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
            
            {/* --- ALTERAÇÃO: Wrapper para a busca --- */}
            <div className={styles.searchContainerWrapper} ref={searchContainerRef}>
                <div className={styles.searchContainer}>
                    <input 
                        type="text" 
                        placeholder="Buscar livros, coleções..." 
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)} // Abre o dropdown ao focar
                    />
                    <button className={styles.searchButton} aria-label="Buscar"><BsSearch className={styles.searchIcon} /></button>
                </div>

                {/* --- ALTERAÇÃO: Dropdown de resultados da busca --- */}
                <AnimatePresence>
                {isSearchFocused && searchTerm && (
                    <motion.div 
                        className={styles.searchResultsDropdown}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {isSearchLoading ? (
                            <div className={styles.searchStatusMessage}>Buscando...</div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(product => (
                                <Link href={`/${product.slug}`} key={product.id} className={styles.searchResultItem} onClick={handleResultClick}>
                                    <Image 
                                        src={product.imagens?.[0] || 'https://placehold.co/50x50.png'} 
                                        alt={product.nome}
                                        width={50}
                                        height={50}
                                        className={styles.searchResultImage}
                                    />
                                    <div className={styles.searchResultInfo}>
                                        <span className={styles.searchResultName}>{product.nome}</span>
                                        <span className={styles.searchResultPrice}>R$ {product.variacoes?.[0]?.preco || '0.00'}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className={styles.searchStatusMessage}>Nenhum resultado encontrado.</div>
                        )}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            <div className={styles.mainActionIcons}>
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
              
              <Link href="/cart" className={styles.mainActionLink}>
                <div className={styles.cartIconWrapper}>
                  <BsCart className={styles.mainIcon} />
                  {totalItemsInCart > 0 && (
                    <span className={styles.cartBadge}>{totalItemsInCart}</span>
                  )}
                </div>
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