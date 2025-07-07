'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // 1. Importar o hook de autenticação
import Link from 'next/link';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import CartItemList from '@/components/CartPage/CartItemList';
import CartSummary from '@/components/CartPage/CartSummary';
import styles from '@/components/CartPage/CartPage.module.css';
import { BsEmojiFrown } from 'react-icons/bs';
import api from '@/services/api'; // 2. Importar nossa API

export default function CartPage() {
  const { cartItems } = useCart();
  const { isAuthenticated, isAuthLoading } = useAuth(); // 3. Obter status de autenticação

  // 4. Estado para armazenar o endereço principal do usuário
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  // 5. Efeito para buscar os endereços se o usuário estiver logado
  useEffect(() => {
    // Só executa quando a verificação de autenticação terminar
    if (!isAuthLoading) {
      if (isAuthenticated) {
        api.get('/enderecos')
          .then(response => {
            const addresses = response.data;
            // Encontra o endereço principal ou pega o primeiro da lista
            const mainAddress = addresses.find(addr => addr.principal) || (addresses.length > 0 ? addresses[0] : null);
            setPrimaryAddress(mainAddress);
          })
          .catch(error => {
            console.error("Erro ao buscar endereços:", error);
          })
          .finally(() => {
            setIsLoadingAddress(false);
          });
      } else {
        // Se não está autenticado, não há endereço para carregar
        setIsLoadingAddress(false);
      }
    }
  }, [isAuthenticated, isAuthLoading]);


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Meu Carrinho', href: null },
  ];

  if (cartItems.length === 0) {
    return (
      <main className={styles.mainContainer}>
        <Breadcrumb items={breadcrumbItems} />
        <div className={styles.emptyCartContainer}>
          <BsEmojiFrown className={styles.emptyCartIcon} />
          <h1>Seu carrinho de sonhos está vazio!</h1>
          <p>Parece que você ainda não adicionou nenhuma magia. Que tal explorar nosso catálogo?</p>
          <Link href="/catalog" className={styles.emptyCartButton}>
            Explorar Catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className={styles.pageTitle}>Meu Carrinho de Sonhos</h1>
      <div className={styles.cartLayout}>
        <div className={styles.cartItemsColumn}>
          <CartItemList />
        </div>
        <div className={styles.cartSummaryColumn}>
          {/* 6. Passar o endereço e o estado de carregamento para o CartSummary */}
          <CartSummary userAddress={primaryAddress} isLoadingAddress={isLoadingAddress} />
        </div>
      </div>
    </main>
  );
}