// src/components/CheckoutPage/CheckoutSteps.js

'use client';

// Importar motion AQUI
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // <-- Adicionado motion aqui
import AccordionStep from './AccordionStep';
import UserInfoStep from './steps/UserInfoStep';
import ShippingStep from './steps/ShippingStep';
import PaymentStep from './steps/PaymentStep';
import api from '@/services/api'; 
import { useCart } from '@/context/CartContext'; 

const CheckoutSteps = ({ currentStep, setCurrentStep, isAuthenticated, isAuthLoading, initialCheckoutData, onUserDataComplete, onShippingComplete }) => {
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
    setCurrentStep(2);
  };

  const handleShippingComplete = (method) => {
    setSelectedShippingMethod(method);
    onShippingComplete(method); 
    setCurrentStep(3);
  };

  const handlePaymentComplete = (paymentResult) => {
     console.log("Pagamento concluído (simulação):", paymentResult);
     // TODO: Lidar com o resultado do pagamento real
     // Ex: router.push('/pagamento/sucesso?pedidoId=...');
  };

   const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div>
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
             <motion.div key="step1" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}> {/* Adicionada animação de slide */}
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
                    />
                </AccordionStep>
             </motion.div>
        )}

        {currentStep === 2 && (
             <motion.div key="step2" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}> {/* Adicionada animação de slide */}
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
                    />
                </AccordionStep>
             </motion.div>
        )}

        {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}> {/* Adicionada animação de slide */}
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
                    />
                </AccordionStep>
            </motion.div>
        )}

         {/* Renderiza passos anteriores como completos/fechados se já passou por eles */}
        {/* Estes devem ser *fora* do bloco AnimatePresence principal se quiser que fiquem estáticos, ou dentro de outro AnimatePresence se quiser animar o conteúdo deles */}
        {/* Para simplicidade e evitar conflitos com a animação do passo ativo, vamos mantê-los fora ou refatorar a estrutura de animação */}

        {/* Opção 1: Renderizar todos dentro do mesmo AnimatePresence (um pouco mais complexo para gerenciar o `isOpen`) */}
        {/* Opção 2: Renderizar o passo ativo dentro de AnimatePresence e os anteriores/próximos estaticamente (mais simples) */}
        
        {/* Vamos seguir a Opção 2 para evitar o erro atual e manter o comportamento do acordeão */}
        {/* Removemos os blocos de renderização de passos anteriores dentro do AnimatePresence principal */}
        {/* A lógica de `isOpen` e `isCompleted` no `AccordionStep` já gerencia o visual */}
        {/* A mudança de `currentStep` fará com que o passo anterior saia e o próximo entre */}
      </AnimatePresence>

       {/* Renderizar os passos anteriores *fora* do AnimatePresence principal para que o estado `isOpen` e `isCompleted` funcione corretamente no AccordionStep */}
        {currentStep > 1 && (
             <AccordionStep
                 stepNumber={1}
                 title="Identificação e Entrega"
                 isOpen={currentStep === 1} // Aberto só no passo 1
                 isCompleted={true} // Sempre completo se passou por ele
                 onToggle={() => setCurrentStep(1)} 
             />
        )}
         {currentStep > 2 && (
             <AccordionStep
                 stepNumber={2}
                 title="Opções de Frete"
                 isOpen={currentStep === 2} // Aberto só no passo 2
                 isCompleted={true} 
                 onToggle={() => setCurrentStep(2)}
             />
        )}
         {/* Adicionar passo 3 também para permitir clicar e voltar */}
         {currentStep > 3 && (
             <AccordionStep
                 stepNumber={3}
                 title="Pagamento"
                 isOpen={currentStep === 3} // Aberto só no passo 3
                 isCompleted={true} // Ou false, dependendo se o pagamento foi finalizado
                 onToggle={() => setCurrentStep(3)}
             />
        )}

    </div>
  );
};

export default CheckoutSteps;