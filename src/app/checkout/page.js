// src/app/checkout/page.js

'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/components/CheckoutPage/CheckoutPage.module.css';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import CheckoutSteps from '@/components/CheckoutPage/CheckoutSteps';
import OrderSummary from '@/components/CheckoutPage/OrderSummary';
import StepIndicator from '@/components/CheckoutPage/StepIndicator';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { cartItems } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [initialCheckoutData, setInitialCheckoutData] = useState(null);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const [finalUserData, setFinalUserData] = useState(null);
  const [finalShippingMethod, setFinalShippingMethod] = useState(null);
  const [finalAppliedCoupon, setFinalAppliedCoupon] = useState(null);

  // NOVO: Determina se todos os itens do carrinho são digitais
  const allCartItemsAreDigital = cartItems.every(item => item.variation.digital === true);

  // Redireciona para o carrinho se estiver vazio ou se não houver dados iniciais
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
    
    if (typeof window !== 'undefined' && !hasLoadedInitialData) {
       const storedData = localStorage.getItem('checkout_data');
       if (storedData) {
         try {
            const parsedData = JSON.parse(storedData);
            setInitialCheckoutData(parsedData);
            setFinalShippingMethod(parsedData.shippingMethod);
            setFinalAppliedCoupon(parsedData.coupon);
            localStorage.removeItem('checkout_data');
         } catch(error) {
            console.error("Erro ao parsear dados iniciais do checkout:", error);
            localStorage.removeItem('checkout_data');
            setInitialCheckoutData(null);
         }
       }
       setHasLoadedInitialData(true);
    }

    if (hasLoadedInitialData && !initialCheckoutData && cartItems.length > 0) {
        // router.push('/cart'); 
    }

  }, [cartItems, router, hasLoadedInitialData, initialCheckoutData]);


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Meu Carrinho', href: '/cart' },
    { label: 'Finalizar Compra', href: null },
  ];

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
          <CheckoutSteps 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep} 
            isAuthenticated={isAuthenticated} 
            isAuthLoading={isAuthLoading} 
            initialCheckoutData={initialCheckoutData}
            onUserDataComplete={(data) => setFinalUserData(data)}
            onShippingComplete={(method) => setFinalShippingMethod(method)}
            finalAppliedCoupon={finalAppliedCoupon}
            allCartItemsAreDigital={allCartItemsAreDigital} // NOVO: Passar flag digital
          />
        </div>
        <div className={styles.summaryColumn}>
          <OrderSummary 
             cartItems={cartItems}
             selectedShippingMethod={finalShippingMethod} 
             appliedCoupon={finalAppliedCoupon}
             allCartItemsAreDigital={allCartItemsAreDigital} // NOVO: Passar flag digital
          />
        </div>
      </div>
    </main>
  );
}