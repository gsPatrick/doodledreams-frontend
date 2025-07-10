// src/components/CheckoutPage/CheckoutSteps.js

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AccordionStep from './AccordionStep';
import UserInfoStep from './steps/UserInfoStep';
import ShippingStep from './steps/ShippingStep';
import PaymentStep from './steps/PaymentStep';
import api from '@/services/api'; 
import { useCart } from '@/context/CartContext'; 

// Recebe currentStep, setCurrentStep, isAuthenticated, isAuthLoading, initialCheckoutData, onUserDataComplete, onShippingComplete, finalAppliedCoupon E allCartItemsAreDigital
const CheckoutSteps = ({ currentStep, setCurrentStep, isAuthenticated, isAuthLoading, initialCheckoutData, onUserDataComplete, onShippingComplete, finalAppliedCoupon, allCartItemsAreDigital }) => {
  const { cartItems } = useCart();

  const [userData, setUserData] = useState(null); 
  const [userAddresses, setUserAddresses] = useState([]); 
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

  const fetchUserAddresses = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoadingAddresses(true);
      try {
        const response = await api.get('/enderecos');
        setUserAddresses(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar endereços para checkout:", error);
        setUserAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    } else {
      setUserAddresses([]);
      setIsLoadingAddresses(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) { 
      fetchUserAddresses();
    }
  }, [isAuthLoading, fetchUserAddresses]);

  useEffect(() => {
    if (initialCheckoutData?.shippingMethod) {
       setSelectedShippingMethod(initialCheckoutData.shippingMethod);
    }
  }, [initialCheckoutData]);


  const handleUserDataComplete = (data) => {
    setUserData(data);
    onUserDataComplete(data);
    // NOVO: Se o pedido é digital, pula direto para o passo de pagamento
    if (allCartItemsAreDigital) {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
  };

  const handleShippingComplete = (method) => {
    setSelectedShippingMethod(method);
    onShippingComplete(method); 
    setCurrentStep(3);
  };

  const handlePaymentComplete = (paymentResult) => {
     console.log("Pagamento concluído (simulação):", paymentResult);
  };

   const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div>
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
             <motion.div key="step1" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
                <AccordionStep
                    stepNumber={1}
                    title="Identificação e Entrega"
                    isOpen={true} 
                    isCompleted={!!userData} 
                    onToggle={() => setCurrentStep(1)} 
                >
                    <UserInfoStep 
                        isAuthenticated={isAuthenticated}
                        isAuthLoading={isAuthLoading}
                        userAddresses={userAddresses} 
                        isLoadingAddresses={isLoadingAddresses}
                        initialCep={initialCheckoutData?.cep} 
                        onLoginOrRegisterSuccess={fetchUserAddresses} 
                        onComplete={handleUserDataComplete} 
                        allCartItemsAreDigital={allCartItemsAreDigital} // NOVO: Passar flag digital
                    />
                </AccordionStep>
             </motion.div>
        )}

        {/* NOVO: Condicionalmente renderiza o ShippingStep ou o oculta */}
        {!allCartItemsAreDigital && currentStep === 2 && (
             <motion.div key="step2" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
                <AccordionStep
                    stepNumber={2}
                    title="Opções de Frete"
                    isOpen={true}
                    isCompleted={!!selectedShippingMethod} 
                    onToggle={() => setCurrentStep(2)}
                >
                    <ShippingStep 
                        onPrev={handlePrev} 
                        onComplete={handleShippingComplete} 
                        userAddress={userData} 
                        initialShippingMethod={initialCheckoutData?.shippingMethod}
                        cartItems={cartItems} 
                        allCartItemsAreDigital={allCartItemsAreDigital} // NOVO: Passar flag digital
                    />
                </AccordionStep>
             </motion.div>
        )}
        {/* Se o pedido é digital, o passo 2 é "completado" automaticamente */}
        {allCartItemsAreDigital && currentStep === 3 && (
           <AccordionStep
                stepNumber={2}
                title="Opções de Frete (Digital)"
                isOpen={false} // Fechado
                isCompleted={true} // Sempre completo
                onToggle={() => setCurrentStep(2)} // Permite voltar se for o caso
            >
                {/* Conteúdo simples para o passo 2 quando é digital */}
                <p>Entrega digital. Não há custo de frete.</p>
            </AccordionStep>
        )}


        {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
                <AccordionStep
                    stepNumber={3}
                    title="Pagamento"
                    isOpen={true}
                    isCompleted={false} 
                    onToggle={() => setCurrentStep(3)}
                >
                    <PaymentStep 
                        onPrev={handlePrev} 
                        onComplete={handlePaymentComplete} 
                        finalShippingMethod={selectedShippingMethod} 
                        finalUserData={userData} 
                        cartItems={cartItems} 
                        finalAppliedCoupon={finalAppliedCoupon}
                        allCartItemsAreDigital={allCartItemsAreDigital} // NOVO: Passar flag digital
                    />
                </AccordionStep>
            </motion.div>
        )}
      </AnimatePresence>

        {currentStep > 1 && (
             <AccordionStep
                 stepNumber={1}
                 title="Identificação e Entrega"
                 isOpen={currentStep === 1} 
                 isCompleted={true} 
                 onToggle={() => setCurrentStep(1)} 
             />
        )}
         {/* Renderiza o passo de frete anterior/completo se não for digital */}
         {!allCartItemsAreDigital && currentStep > 2 && (
             <AccordionStep
                 stepNumber={2}
                 title="Opções de Frete"
                 isOpen={currentStep === 2} 
                 isCompleted={true} 
                 onToggle={() => setCurrentStep(2)}
             />
        )}
        {/* Renderiza o passo de frete digital anterior/completo se for digital */}
        {allCartItemsAreDigital && currentStep > 2 && ( // currentStep > 2 porque o digital sempre vai pro 3
            <AccordionStep
                stepNumber={2}
                title="Opções de Frete (Digital)"
                isOpen={false}
                isCompleted={true}
                onToggle={() => setCurrentStep(2)}
            />
        )}

         {currentStep > 3 && ( // Mantenha currentStep > 3 para o passo 3 completo
             <AccordionStep
                 stepNumber={3}
                 title="Pagamento"
                 isOpen={currentStep === 3} 
                 isCompleted={true} 
                 onToggle={() => setCurrentStep(3)}
             />
        )}
    </div>
  );
};

export default CheckoutSteps;