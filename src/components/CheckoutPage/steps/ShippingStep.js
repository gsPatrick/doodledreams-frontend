// src/components/CheckoutPage/steps/ShippingStep.js

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from '../CheckoutPage.module.css';
import { BsBoxSeam } from 'react-icons/bs';
import api from '@/services/api'; 

// Recebe userAddress (OBJETO completo), initialShippingMethod (OBJETO método), cartItems (ARRAY)
const ShippingStep = ({ onComplete, onPrev, userAddress, initialShippingMethod, cartItems }) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // SelectedOption é o OBJETO do método
  const [isLoading, setIsLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');

  // Calcular frete usando o endereço COMPLETO fornecido e os itens do carrinho
  const calculateShipping = useCallback(async (address) => {
    if (!address || !address.cep || address.cep.replace(/\D/g, '').length !== 8) {
      setShippingOptions([]);
      setSelectedOption(null);
      setShippingError('Endereço de entrega inválido para cálculo de frete.');
      return;
    }

    setIsLoading(true);
    setShippingError('');
    setShippingOptions([]);
    setSelectedOption(null); 

    try {
      const response = await api.post('/frete/calcular', {
        enderecoDestino: { cep: address.cep },
        itens: cartItems.map(item => ({
          produtoId: item.id,
          quantidade: item.quantity,
          variacaoId: item.variation.id 
        }))
      });
      const validOptions = response.data.filter(opt => !opt.error);
      setShippingOptions(validOptions);

      // --- Lógica de Pré-seleção ---
      let preSelected = null;
      if (initialShippingMethod) {
        // Tenta encontrar o método inicial entre as opções válidas retornadas
        preSelected = validOptions.find(opt => opt.id === initialShippingMethod.id);
      }

      // Se o método inicial foi encontrado OU se não havia método inicial, mas há opções, seleciona o primeiro válido
      if (preSelected) {
         setSelectedOption(preSelected);
      } else if (validOptions.length > 0) {
        setSelectedOption(validOptions[0]);
      } else {
        // Nenhuma opção válida encontrada
        setShippingError('Nenhuma opção de frete disponível para o endereço informado.');
      }

    } catch (err) {
      console.error("Erro ao buscar frete:", err.response?.data?.message || err.message);
      setShippingError(err.response?.data?.message || 'Não foi possível calcular o frete.');
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, cartItems, initialShippingMethod]); // Depende do endereço e itens do carrinho

  // Efeito para disparar o cálculo de frete quando o endereço do usuário ou itens mudam
  useEffect(() => {
    // Dispara o cálculo apenas se o userAddress está disponível e os itens existem
    if (userAddress && cartItems.length > 0) {
       // O calculateShipping já lida com o initialShippingMethod dentro dele
       calculateShipping(userAddress);
    } else if (!userAddress) {
       // Se o userAddress não está disponível (algo deu errado no passo 1)
       setShippingError('Por favor, retorne ao passo anterior para informar o endereço.');
       setShippingOptions([]);
       setSelectedOption(null);
    }

  }, [userAddress, cartItems, calculateShipping]); // Depende do userAddress e cartItems


  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  // Renderização
  if (!userAddress) {
      // Se o endereço não veio do passo 1, não renderiza as opções de frete
      return (
          <div className={styles.infoText}>
             Aguardando informações de endereço do passo anterior...
              <div className={styles.stepActions}>
                <button type="button" onClick={onPrev} className={styles.prevButton}>Voltar</button>
                {/* Botão próximo desabilitado pois não tem endereço */}
                <button type="button" className={styles.nextButton} disabled={true}>
                  Ir para Pagamento
                </button>
              </div>
          </div>
      );
  }


  return (
    <div>
      {/* Não mostra o formulário de CEP manual aqui, usa apenas o endereço do passo 1 */}
       <div className={styles.infoText}>
         Calculando frete para: <strong>{userAddress.cep}</strong> ({userAddress.rua}, {userAddress.numero})
       </div>

      {shippingError && <p className={styles.shippingError}>{shippingError}</p>}

      {isLoading ? (
        <p className={styles.loadingText}>Calculando opções de frete...</p>
      ) : shippingOptions.length > 0 ? (
        <div className={styles.shippingOptions}>
          {shippingOptions.map(option => (
            <label 
              key={option.id}
              className={`${styles.shippingOption} ${selectedOption?.id === option.id ? styles.selected : ''}`}
              onClick={() => handleSelectOption(option)}
            >
              <input type="radio" name="shipping" value={option.id} checked={selectedOption?.id === option.id} onChange={() => {}} />
              <div className={styles.shippingDetails}>
                <BsBoxSeam />
                <div>
                  <p>{option.name}</p>
                  <span>Prazo: {option.delivery_time} dia(s) útil(eis).</span>
                  {option.custom_description && <span className={styles.shippingOptionDesc}>{option.custom_description}</span>}
                </div>
              </div>
              <span className={styles.shippingPrice}>R$ {parseFloat(option.price).toFixed(2).replace('.',',')}</span>
            </label>
          ))}
        </div>
      ) : (
        !shippingError && <p className={styles.infoText}>Nenhuma opção de frete disponível para o endereço informado.</p>
      )}
      
      <div className={styles.stepActions}>
        <button type="button" onClick={onPrev} className={styles.prevButton}>Voltar</button>
        {/* Chamar onComplete com a opção selecionada */}
        <button type="button" onClick={() => onComplete(selectedOption)} className={styles.nextButton} disabled={!selectedOption}>
          Ir para Pagamento
        </button>
      </div>
    </div>
  );
};

export default ShippingStep;