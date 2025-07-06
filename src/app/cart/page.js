'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import CartItemList from '@/components/CartPage/CartItemList';
import CartSummary from '@/components/CartPage/CartSummary';
import styles from '@/components/CartPage/CartPage.module.css';
import { BsEmojiFrown } from 'react-icons/bs';

export default function CartPage() {
  const { cartItems } = useCart();

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
          <CartSummary />
        </div>
      </div>
    </main>
  );
}