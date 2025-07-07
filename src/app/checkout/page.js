// src/app/checkout/page.js

'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/components/CheckoutPage/CheckoutPage.module.css';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import CheckoutSteps from '@/components/CheckoutPage/CheckoutSteps';
import OrderSummary from '@/components/CheckoutPage/OrderSummary'; // Importe o OrderSummary do checkout
import StepIndicator from '@/components/CheckoutPage/StepIndicator';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { cartItems } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Estado para armazenar os dados iniciais vindo do carrinho
  const [initialCheckoutData, setInitialCheckoutData] = useState(null);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  // Estados para dados que transitam entre os passos
  const [finalUserData, setFinalUserData] = useState(null); // Dados do Passo 1 (usuário + endereço)
  const [finalShippingMethod, setFinalShippingMethod] = useState(null); // Dados do Passo 2 (frete selecionado)

  // Redireciona para o carrinho se estiver vazio ou se não houver dados iniciais de frete
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
    
    if (typeof window !== 'undefined' && !hasLoadedInitialData) {
       const storedData = localStorage.getItem('checkout_initial_data');
       if (storedData) {
         try {
            const parsedData = JSON.parse(storedData);
            setInitialCheckoutData(parsedData);
            localStorage.removeItem('checkout_initial_data'); // Limpar após carregar
         } catch(error) {
            console.error("Erro ao parsear dados iniciais do checkout:", error);
            // Se der erro, limpa e força a começar do zero (sem frete pré-selecionado)
            localStorage.removeItem('checkout_initial_data');
            setInitialCheckoutData(null);
         }
       }
       setHasLoadedInitialData(true); // Marca como carregado
    }

     // Se já carregou os dados iniciais E ELES NÃO EXISTEM, redireciona de volta
     // Isso impede que a pessoa acesse /checkout diretamente sem passar pelo carrinho
    if (hasLoadedInitialData && !initialCheckoutData && cartItems.length > 0) {
        // Comentado para permitir testar a página de checkout diretamente se necessário
        // router.push('/cart'); 
    }

  }, [cartItems, router, hasLoadedInitialData, initialCheckoutData]);


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Meu Carrinho', href: '/cart' },
    { label: 'Finalizar Compra', href: null },
  ];

  // Não renderiza nada se o carrinho estiver vazio
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

      {/* Passamos o frete final para o StepIndicator */}
      <StepIndicator currentStep={currentStep} finalShippingMethod={finalShippingMethod} />
      
      <div className={styles.checkoutLayout}>
        <div className={styles.stepsColumn}>
          <CheckoutSteps 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep} 
            isAuthenticated={isAuthenticated} 
            isAuthLoading={isAuthLoading} 
            initialCheckoutData={initialCheckoutData} // Passa os dados iniciais (frete + cep)
            onUserDataComplete={(data) => setFinalUserData(data)} // Callback para setar dados do passo 1
            onShippingComplete={(method) => setFinalShippingMethod(method)} // Callback para setar frete do passo 2
          />
        </div>
        <div className={styles.summaryColumn}>
          {/* Passamos o frete final para o OrderSummary do checkout */}
          <OrderSummary 
             cartItems={cartItems} // Passar itens do carrinho também
             selectedShippingMethod={finalShippingMethod} 
          />
        </div>
      </div>
    </main>
  );
}