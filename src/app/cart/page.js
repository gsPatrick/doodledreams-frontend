// src/app/cart/page.js

'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import CartItemList from '@/components/CartPage/CartItemList';
import CartSummary from '@/components/CartPage/CartSummary';
import styles from '@/components/CartPage/CartPage.module.css';
import { BsEmojiFrown } from 'react-icons/bs';
import api from '@/services/api';

export default function CartPage() {
  const { cartItems } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Estado para armazenar *todos* os endereços do usuário
  const [userAddresses, setUserAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Efeito para buscar os endereços se o usuário estiver logado
  useEffect(() => {
    if (!isAuthLoading) { // Garante que a autenticação já foi verificada
      if (isAuthenticated) {
        api.get('/enderecos')
          .then(response => {
            setUserAddresses(response.data || []);
          })
          .catch(error => {
            console.error("Erro ao buscar endereços:", error);
            // Pode exibir uma mensagem de erro na UI, ou fallback para entrada manual
          })
          .finally(() => {
            setIsLoadingAddresses(false);
          });
      } else {
        // Se não está autenticado, não há endereços para carregar
        setUserAddresses([]);
        setIsLoadingAddresses(false);
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
          {/* Passar todos os endereços e o estado de carregamento */}
          <CartSummary 
            allUserAddresses={userAddresses} 
            isLoadingAddresses={isLoadingAddresses} 
          />
        </div>
      </div>
    </main>
  );
}