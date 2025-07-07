// src/components/CartPage/CartSummary.js

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CartPage.module.css';
import { motion } from 'framer-motion';
import api from '@/services/api';
import { useRouter } from 'next/navigation'; // Importar useRouter

const CartSummary = ({ allUserAddresses, isLoadingAddresses }) => {
  const { cartItems } = useCart();
  const router = useRouter(); // Inicializar useRouter

  const [subtotal, setSubtotal] = useState(0);
  // Controla a opção de seleção de endereço: 'principal', 'outro_endereco_id', 'novo_cep'
  const [selectedAddressOption, setSelectedAddressOption] = useState('principal'); 
  const [manualCep, setManualCep] = useState(''); // CEP digitado manualmente
  
  const [shippingOptions, setShippingOptions] = useState([]); // Opções de frete do backend
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null); // Método de frete selecionado
  
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');

  // Calcula o subtotal dos itens no carrinho
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.variation.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  // === NOVA LÓGICA AQUI: Forçar seleção de CEP manual se não houver endereços ===
  useEffect(() => {
    // Se o carregamento de endereços terminou e não há endereços (array vazio ou nulo/undefined)
    // E a opção atual não é 'novo_cep' ainda, força para 'novo_cep'.
    if (!isLoadingAddresses && (!allUserAddresses || allUserAddresses.length === 0)) {
      if (selectedAddressOption !== 'novo_cep') {
        console.log("Detetado: Sem endereços ou usuário não logado. Forçando seleção de CEP manual."); // Opcional: Log para depuração
        setSelectedAddressOption('novo_cep');
        // Limpa possíveis mensagens de erro antigas relacionadas à seleção de endereço
        setShippingError(''); 
      }
    } 
    // Se houver endereços, a lógica padrão com a seleção dropwdown será aplicada.
    // Não precisamos de um else para "reverter" aqui, pois o estado inicial é 'principal' 
    // e a UI e o useEffect de cálculo já lidam com a existência de endereços.
  }, [allUserAddresses, isLoadingAddresses, selectedAddressOption]); // Inclui selectedAddressOption nas dependências para evitar loop

  // Função para calcular o frete com base no CEP de destino
  const calculateShipping = useCallback(async (targetCep) => {
    if (!targetCep || targetCep.replace(/\D/g, '').length !== 8) {
      setShippingOptions([]);
      setSelectedShippingMethod(null);
      // Define um erro específico para CEP inválido apenas se estiver no modo manual
      if(selectedAddressOption === 'novo_cep' && manualCep.length > 0) {
         setShippingError('Por favor, insira um CEP válido com 8 dígitos.');
      } else if (selectedAddressOption !== 'novo_cep') {
         // Mensagem mais genérica ou limpa se não for o modo manual com input
         setShippingError('CEP de destino inválido.');
      } else {
         // Limpa erro se o campo manual está vazio e não é válido
         setShippingError('');
      }
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError('');
    setShippingOptions([]);
    setSelectedShippingMethod(null);

    try {
      const response = await api.post('/frete/calcular', {
        enderecoDestino: { cep: targetCep },
        itens: cartItems.map(item => ({
          produtoId: item.id,
          quantidade: item.quantity,
          variacaoId: item.variation.id 
        }))
      });
      const validOptions = response.data.filter(opt => !opt.error);
      setShippingOptions(validOptions);
      // Seleciona a primeira opção de frete por padrão, se houver
      if (validOptions.length > 0) {
        setSelectedShippingMethod(validOptions[0]);
      } else {
        setShippingError('Não foi encontrada nenhuma opção de frete para este CEP.');
      }
    } catch (err) {
      console.error("Erro ao calcular frete:", err.response?.data?.message || err.message);
      setShippingError(err.response?.data?.message || 'Não foi possível calcular o frete para este CEP.');
    } finally {
      setIsCalculatingShipping(false);
    }
  }, [cartItems, selectedAddressOption, manualCep]); // Adicionado selectedAddressOption e manualCep para re-executar se mudar o modo ou o CEP manual

  // Efeito principal para gerenciar o recálculo automático do frete
  // É disparado quando o endereço/CEP selecionado, o CEP manual, a lista de endereços ou os itens do carrinho mudam.
  useEffect(() => {
    // Não calcula frete se ainda está carregando endereços ou carrinho está vazio
    if (isLoadingAddresses || cartItems.length === 0) {
      setShippingOptions([]);
      setSelectedShippingMethod(null);
      return;
    }

    let targetCepToUse = '';
    
    // Encontra o endereço a ser usado com base na seleção
    if (selectedAddressOption === 'novo_cep') {
      targetCepToUse = manualCep;
    } else if (selectedAddressOption === 'principal') {
      // Tenta usar o principal. Se não existir principal, usa o primeiro da lista (se houver)
      const principalOrFirstAddress = allUserAddresses?.find(addr => addr.principal) || (allUserAddresses && allUserAddresses.length > 0 ? allUserAddresses[0] : null);
      if (principalOrFirstAddress) {
         targetCepToUse = principalOrFirstAddress.cep;
      }
    } else { // selectedAddressOption é um ID de endereço
      const selectedAddr = allUserAddresses?.find(addr => addr.id === selectedAddressOption);
      if (selectedAddr) {
        targetCepToUse = selectedAddr.cep;
      }
    }

    // Dispara o cálculo se um CEP de destino foi determinado E ele é válido
    if (targetCepToUse && targetCepToUse.replace(/\D/g, '').length === 8) {
        calculateShipping(targetCepToUse);
    } else {
        // Limpa opções e erro se o CEP não é válido ou não foi determinado
        setShippingOptions([]);
        setSelectedShippingMethod(null);
        // Define uma mensagem de erro apropriada se não for o modo manual com campo vazio
        if (selectedAddressOption !== 'novo_cep' || manualCep.length > 0) {
            // Se for modo manual e tem algo digitado, o calculateShipping já colocou o erro.
            // Se não for modo manual, ou se o campo manual está vazio, mostra este erro genérico.
             setShippingError('Selecione um endereço ou insira um CEP para calcular o frete.');
        } else {
             // Limpa erro se o campo manual está vazio
             setShippingError('');
        }
    }

    // Dependências: Recalcula se a opção de endereço, o CEP manual, a lista de endereços ou os itens do carrinho mudam.
    // isLoadingAddresses também, pois a lógica de seleção só roda após carregar.
  }, [selectedAddressOption, manualCep, allUserAddresses, isLoadingAddresses, cartItems, calculateShipping]);


  // Lidar com a mudança na seleção do tipo de endereço/CEP (dropdown)
  const handleAddressOptionChange = (e) => {
    const value = e.target.value;
    setSelectedAddressOption(value);
    setManualCep(''); // Limpa CEP manual ao mudar a opção
    setSelectedShippingMethod(null); // Limpa frete selecionado
    setShippingOptions([]); // Limpa opções
    setShippingError(''); // Limpa erro
  };

  // Lidar com a entrada de CEP manual
  const handleManualCepChange = (e) => {
    setManualCep(e.target.value.replace(/\D/g, ''));
    setSelectedShippingMethod(null); // Limpa frete selecionado
    setShippingOptions([]); // Limpa opções
    setShippingError(''); // Limpa erro
  };

  // Função para prosseguir para o checkout
  const handleProceedToCheckout = () => {
    if (selectedShippingMethod) {
      // Determinar o CEP final a ser salvo com o método de frete
      let finalCep = '';
      if (selectedAddressOption === 'novo_cep') {
        finalCep = manualCep;
      } else {
        // Encontrar o endereço selecionado (ou principal, ou o primeiro se nenhum principal)
        // Usar optional chaining (?.) para segurança caso allUserAddresses seja null/undefined
        const selectedAddr = allUserAddresses?.find(addr => addr.id === selectedAddressOption);
        finalCep = selectedAddr ? selectedAddr.cep : (allUserAddresses?.find(addr => addr.principal) || allUserAddresses?.[0])?.cep;
      }

      // Salva o método de frete e o CEP utilizado no localStorage
      // Armazenar também o nome do método para facilitar exibição no checkout
      localStorage.setItem('checkout_shipping_method_data', JSON.stringify({
        method: selectedShippingMethod,
        cep: finalCep,
        methodName: selectedShippingMethod.name // O nome do método, ex: "Correios SEDEX"
      }));
      router.push('/checkout');
    }
  };

  const currentShippingCost = selectedShippingMethod ? parseFloat(selectedShippingMethod.price) : 0;
  const totalWithShipping = subtotal + currentShippingCost;

  return (
    <div className={styles.summaryContainer}>
      <h2>Resumo do Pedido</h2>
      
      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
      </div>

      <div className={styles.shippingSection}>
        <h3>Entrega</h3>
        {isLoadingAddresses ? (
            <p className={styles.loadingText}>Carregando endereços...</p>
        ) : (
          <>
            {/* Só mostra o dropdown de seleção de endereço se houver endereços cadastrados */}
            {allUserAddresses && allUserAddresses.length > 0 ? (
              <div className={styles.formGroup}>
                <label htmlFor="address-option">Opções de Endereço:</label>
                <select 
                  id="address-option" 
                  className={styles.selectInput}
                  value={selectedAddressOption} 
                  onChange={handleAddressOptionChange}
                >
                  {/* Opção padrão para o endereço principal (se existir) */}
                  {allUserAddresses.some(addr => addr.principal) && (
                    <option value="principal">Endereço Principal ({allUserAddresses.find(addr => addr.principal).cep})</option>
                  )}
                   {/* Primeiro endereço se não houver principal (ajuste sutil para garantir que algo esteja selecionável/visível) */}
                  {!allUserAddresses.some(addr => addr.principal) && allUserAddresses[0] && (
                       <option value={allUserAddresses[0].id}>
                         {allUserAddresses[0].apelido || `${allUserAddresses[0].rua}, ${allUserAddresses[0].numero}`} ({allUserAddresses[0].cep})
                       </option>
                  )}
                  {/* Outros endereços cadastrados, excluindo o principal e o primeiro se já listado */}
                  {allUserAddresses.filter(addr => !addr.principal && addr.id !== (allUserAddresses[0]?.id || null) ).map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {addr.apelido || `${addr.rua}, ${addr.numero}`} ({addr.cep})
                    </option>
                  ))}
                  {/* Opção para inserir CEP manualmente (sempre disponível se houver endereços) */}
                  <option value="novo_cep">Outro CEP (Manual)</option>
                </select>
              </div>
            ) : (
                // Mensagem quando não há endereços cadastrados
                <p className={styles.infoText}>Você não tem endereços cadastrados. Por favor, insira um CEP para calcular o frete.</p>
            )}

            {/* O campo de input de CEP manual só aparece se a opção 'novo_cep' estiver selecionada */}
            {selectedAddressOption === 'novo_cep' && (
              <div className={styles.formGroup}>
                <label htmlFor="manual-cep">Digite o CEP:</label>
                <input
                  type="text"
                  id="manual-cep"
                  className={styles.textInput}
                  placeholder="00000-000"
                  value={manualCep}
                  onChange={handleManualCepChange}
                  maxLength={9} 
                />
              </div>
            )}

            {/* Exibe a mensagem de erro, se houver */}
            {shippingError && <p className={styles.shippingError}>{shippingError}</p>}
            
            {/* Área de exibição das opções de frete */}
            {isCalculatingShipping ? (
              <p className={styles.loadingText}>Calculando opções de frete...</p>
            ) : (
              shippingOptions.length > 0 ? (
                <div className={styles.shippingOptionsList}>
                  {shippingOptions.map(option => (
                    <label key={option.id} className={styles.shippingOptionCard}>
                      <input 
                        type="radio" 
                        name="shippingMethod" 
                        value={option.id} 
                        checked={selectedShippingMethod?.id === option.id}
                        onChange={() => setSelectedShippingMethod(option)}
                        className={styles.shippingRadio}
                      />
                      <div className={styles.shippingOptionDetails}>
                        <p className={styles.shippingOptionName}>{option.name}</p>
                        <span className={styles.shippingOptionTime}>Prazo: {option.delivery_time} dia(s) útil(eis)</span>
                        {option.custom_description && <span className={styles.shippingOptionDesc}>{option.custom_description}</span>}
                      </div>
                      <span className={styles.shippingOptionPrice}>R$ {parseFloat(option.price).toFixed(2).replace('.', ',')}</span>
                    </label>
                  ))}
                </div>
              ) : (
                 // Mostra esta mensagem apenas se não houver opções E não houver erro (o erro já explica)
                !shippingError && <p className={styles.infoText}>Nenhuma opção de frete disponível para o CEP ou itens selecionados.</p>
              )
            )}
          </>
        )}
      </div>

      <div className={`${styles.summaryRow} ${styles.totalRow}`}>
        <span>Total</span>
        <span>R$ {totalWithShipping.toFixed(2).replace('.', ',')}</span>
      </div>

      <motion.button
        className={styles.checkoutButton}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleProceedToCheckout} 
        // Desabilita o botão se não há método de frete selecionado,
        // se está calculando, ou se o carrinho está vazio.
        disabled={!selectedShippingMethod || isCalculatingShipping || cartItems.length === 0}
      >
        Ir para o Pagamento
      </motion.button>
    </div>
  );
};

export default CartSummary;