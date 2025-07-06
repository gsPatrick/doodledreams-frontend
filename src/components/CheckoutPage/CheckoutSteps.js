'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AccordionStep from './AccordionStep';
import UserInfoStep from './steps/UserInfoStep';
import ShippingStep from './steps/ShippingStep';
import PaymentStep from './steps/PaymentStep';

const CheckoutSteps = ({ currentStep, setCurrentStep }) => {
  // Estado para armazenar os dados coletados nos passos
  const [userData, setUserData] = useState({ email: '', name: '', address: '', city: '', state: '', zip: '' });
  const [shippingMethod, setShippingMethod] = useState(null);

  // Manipuladores para avançar/voltar
  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Função para atualizar os dados do usuário
  const handleUserDataSubmit = (data) => {
    setUserData(data);
    handleNext();
  };

  // Função para selecionar o frete
  const handleShippingSelect = (method) => {
    setShippingMethod(method);
    handleNext();
  };

  return (
    <div>
      <AnimatePresence>
        <AccordionStep
          stepNumber={1}
          title="Identificação e Entrega"
          isOpen={currentStep === 1}
          isCompleted={!!userData.email} // Passo concluído se o email foi preenchido
          onToggle={() => setCurrentStep(1)}
        >
          <UserInfoStep onNext={handleUserDataSubmit} />
        </AccordionStep>

        <AccordionStep
          stepNumber={2}
          title="Opções de Frete"
          isOpen={currentStep === 2}
          isCompleted={!!shippingMethod} // Passo concluído se um frete foi escolhido
          onToggle={() => setCurrentStep(2)}
        >
          <ShippingStep 
            onNext={handleShippingSelect} 
            onPrev={handlePrev} 
            userZip={userData.zip}
          />
        </AccordionStep>

        <AccordionStep
          stepNumber={3}
          title="Pagamento"
          isOpen={currentStep === 3}
          isCompleted={false} // Pagamento nunca está "concluído" até o final
          onToggle={() => setCurrentStep(3)}
        >
          <PaymentStep onPrev={handlePrev} />
        </AccordionStep>
      </AnimatePresence>
    </div>
  );
};

export default CheckoutSteps;