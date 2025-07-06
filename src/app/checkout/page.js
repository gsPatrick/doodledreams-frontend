'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/components/CheckoutPage/CheckoutPage.module.css';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation'; // Para redirecionar se o carrinho estiver vazio

// Importando os componentes do checkout
import CheckoutSteps from '@/components/CheckoutPage/CheckoutSteps';
import OrderSummary from '@/components/CheckoutPage/OrderSummary';
import StepIndicator from '@/components/CheckoutPage/StepIndicator';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { cartItems } = useCart();
  const router = useRouter();

  // Redireciona para o carrinho se estiver vazio
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Meu Carrinho', href: '/cart' },
    { label: 'Finalizar Compra', href: null },
  ];

  // Não renderiza nada se o carrinho estiver vazio (até o redirecionamento ocorrer)
  if (cartItems.length === 0) {
    return null; 
  }

  return (
    <main className={styles.mainContainer}>
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.checkoutHeader}>
        <h1>Finalizar Compra</h1>
        <p>Falta pouco para a magia chegar até você!</p>
      </div>

      <StepIndicator currentStep={currentStep} />
      
      <div className={styles.checkoutLayout}>
        <div className={styles.stepsColumn}>
          <CheckoutSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </div>
        <div className={styles.summaryColumn}>
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}