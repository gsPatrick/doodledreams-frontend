'use client';

import React from 'react';
import styles from './AccountPage.module.css';
// Ícones novos: BsDownload, BsPinMapFill
import { BsGrid1X2, BsBoxSeam, BsHeart, BsPerson, BsBoxArrowRight, BsDownload, BsPinMapFill } from 'react-icons/bs';

const AccountSidebar = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: <BsGrid1X2 /> },
    { id: 'orders', label: 'Minhas Compras', icon: <BsBoxSeam /> },
    { id: 'downloads', label: 'Meus Downloads', icon: <BsDownload /> }, // <-- NOVO
    { id: 'addresses', label: 'Meus Endereços', icon: <BsPinMapFill /> }, // <-- NOVO
    { id: 'favorites', label: 'Meus Favoritos', icon: <BsHeart /> },
    { id: 'details', label: 'Meus Dados', icon: <BsPerson /> },
  ];

  const handleLogout = () => {
    alert('Você foi desconectado! (Simulação)');
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`${styles.navButton} ${activeView === item.id ? styles.active : ''}`}
                onClick={() => setActiveView(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button className={styles.logoutButton} onClick={handleLogout}>
        <BsBoxArrowRight />
        <span>Sair</span>
      </button>
    </aside>
  );
};

export default AccountSidebar;