// src/components/CartPage/CartSummary.js

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CartPage.module.css';
import { motion } from 'framer-motion';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

// Objeto de método de entrega digital padrão
const DIGITAL_DELIVERY_METHOD = {
  id: 'digital_delivery',
  name: 'Entrega Digital',
  price: '0.00',
  company: { name: 'Doodle Dreams' },
  delivery_time: 0,
  custom_description: 'Seu produto será entregue por e-mail e estará disponível para download na sua conta.',
};

const CartSummary = ({ allUserAddresses, isLoadingAddresses }) => {
  const { cartItems } = useCart();
  const router = useRouter();

  const [subtotal, setSubtotal] = useState(0);
  const [selectedAddressOption, setSelectedAddressOption] = useState('principal'); 
  const [manualCep, setManualCep] = useState('');
  
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // NOVO: Determina se todos os itens do carrinho são digitais
  const allCartItemsAreDigital = cartItems.every(item => item.variation.digital === true);

  // Calcula o subtotal dos itens no carrinho (base, sem cupom)
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.variation.price * item.quantity,
      0
    );
    setSubtotal(total);
    setAppliedCoupon(null); 
    setCouponCode('');
    setCouponError('');
  }, [cartItems]);

  // Forçar seleção de CEP manual se não houver endereços
  useEffect(() => {
    // Se não for digital e não houver endereços, força seleção de CEP manual.
    // Se for digital, não precisamos forçar, o frete será 0.
    if (!allCartItemsAreDigital && !isLoadingAddresses && (!allUserAddresses || allUserAddresses.length === 0)) {
      if (selectedAddressOption !== 'novo_cep') {
        setSelectedAddressOption('novo_cep');
        setShippingError(''); 
      }
    } 
  }, [allCartItemsAreDigital, allUserAddresses, isLoadingAddresses, selectedAddressOption]);

  // Função para calcular o frete com base no CEP de destino
  const calculateShipping = useCallback(async (targetCep) => {
    // Se todos os itens são digitais, não precisa chamar API de frete
    if (allCartItemsAreDigital) {
      setSelectedShippingMethod(DIGITAL_DELIVERY_METHOD);
      setShippingOptions([DIGITAL_DELIVERY_METHOD]);
      setShippingError('');
      setIsCalculatingShipping(false);
      return;
    }

    if (!targetCep || targetCep.replace(/\D/g, '').length !== 8) {
      setShippingOptions([]);
      setSelectedShippingMethod(null);
      if(selectedAddressOption === 'novo_cep' && manualCep.length > 0) {
         setShippingError('Por favor, insira um CEP válido com 8 dígitos.');
      } else if (selectedAddressOption !== 'novo_cep') {
         setShippingError('CEP de destino inválido.');
      } else {
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
  }, [allCartItemsAreDigital, cartItems, selectedAddressOption, manualCep]);

  // Efeito principal para gerenciar o recálculo automático do frete
  useEffect(() => {
    // Se todos os itens são digitais, define o método de entrega digital imediatamente.
    if (allCartItemsAreDigital) {
        setSelectedShippingMethod(DIGITAL_DELIVERY_METHOD);
        setShippingOptions([DIGITAL_DELIVERY_METHOD]);
        setShippingError('');
        setIsCalculatingShipping(false);
        return;
    }

    // Se não está carregando endereços e o carrinho está vazio, limpa tudo.
    if (isLoadingAddresses || cartItems.length === 0) {
      setShippingOptions([]);
      setSelectedShippingMethod(null);
      return;
    }

    let targetCepToUse = '';
    
    if (selectedAddressOption === 'novo_cep') {
      targetCepToUse = manualCep;
    } else if (selectedAddressOption === 'principal') {
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

    if (targetCepToUse && targetCepToUse.replace(/\D/g, '').length === 8) {
        calculateShipping(targetCepToUse);
    } else {
        setShippingOptions([]);
        setSelectedShippingMethod(null);
        if (selectedAddressOption !== 'novo_cep' || manualCep.length > 0) {
             setShippingError('Selecione um endereço ou insira um CEP para calcular o frete.');
        } else {
             setShippingError('');
        }
    }
  }, [selectedAddressOption, manualCep, allUserAddresses, isLoadingAddresses, cartItems, allCartItemsAreDigital, calculateShipping]);

  // Lidar com a mudança na seleção do tipo de endereço/CEP (dropdown)
  const handleAddressOptionChange = (e) => {
    const value = e.target.value;
    setSelectedAddressOption(value);
    setManualCep('');
    setSelectedShippingMethod(null);
    setShippingOptions([]);
    setShippingError('');
  };

  // Lidar com a entrada de CEP manual
  const handleManualCepChange = (e) => {
    setManualCep(e.target.value.replace(/\D/g, ''));
    setSelectedShippingMethod(null);
    setShippingOptions([]);
    setShippingError('');
  };

  // Aplicar Cupom
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Por favor, digite um código de cupom.');
      setAppliedCoupon(null);
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');
    setAppliedCoupon(null);

    try {
      const totalItemsQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      const response = await api.post('/cupons/validar', {
        codigo: couponCode,
        total: subtotal,
        quantidadeItens: totalItemsQuantity,
      });

      if (response.data.valido) {
        setAppliedCoupon(response.data.cupom);
      } else {
        setCouponError(response.data.erro || 'Cupom inválido.');
      }
    } catch (err) {
      console.error("Erro ao aplicar cupom:", err.response?.data?.erro || err.message);
      setCouponError(err.response?.data?.erro || 'Não foi possível aplicar o cupom. Tente novamente.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Função para prosseguir para o checkout
  const handleProceedToCheckout = () => {
    // Se digital, sempre pode prosseguir
    if (allCartItemsAreDigital) {
      localStorage.setItem('checkout_data', JSON.stringify({
        shippingMethod: DIGITAL_DELIVERY_METHOD, // Força o método digital
        cep: null, // Sem CEP para digital
        coupon: appliedCoupon,
        isDigitalOrder: true, // Adiciona flag para o checkout
      }));
      router.push('/checkout');
      return;
    }

    // Para produtos físicos, exige método de frete selecionado
    if (selectedShippingMethod) {
      let finalCep = '';
      if (selectedAddressOption === 'novo_cep') {
        finalCep = manualCep;
      } else {
        const selectedAddr = allUserAddresses?.find(addr => addr.id === selectedAddressOption);
        finalCep = selectedAddr ? selectedAddr.cep : (allUserAddresses?.find(addr => addr.principal) || allUserAddresses?.[0])?.cep;
      }

      localStorage.setItem('checkout_data', JSON.stringify({
        shippingMethod: selectedShippingMethod,
        cep: finalCep,
        coupon: appliedCoupon,
        isDigitalOrder: false, // Adiciona flag para o checkout
      }));
      router.push('/checkout');
    }
  };

  const subtotalAfterCoupon = appliedCoupon ? appliedCoupon.novoTotalCalculado : subtotal;
  const currentShippingCost = selectedShippingMethod ? parseFloat(selectedShippingMethod.price) : 0;
  const totalWithShipping = subtotalAfterCoupon + currentShippingCost;

  return (
    <div className={styles.summaryContainer}>
      <h2>Resumo do Pedido</h2>
      
      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
      </div>

      <div className={styles.couponSection}>
        <h3>Tem um cupom mágico?</h3>
        {appliedCoupon ? (
          <div className={styles.appliedCoupon}>
            <p>Cupom Aplicado: <strong>{appliedCoupon.codigo}</strong></p>
            <p>Desconto: -R$ {appliedCoupon.descontoCalculado.toFixed(2).replace('.', ',')}</p>
            <button onClick={() => setAppliedCoupon(null)} className={styles.removeCouponButton}>Remover</button>
          </div>
        ) : (
          <div className={styles.couponInputGroup}>
            <input
              type="text"
              placeholder="Digite seu cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className={styles.couponInput}
              disabled={isApplyingCoupon}
            />
            <motion.button
              className={styles.applyCouponButton}
              onClick={handleApplyCoupon}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isApplyingCoupon}
            >
              {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
            </motion.button>
          </div>
        )}
        {couponError && <p className={styles.couponError}>{couponError}</p>}
      </div>

      {appliedCoupon && (
        <div className={styles.summaryRow}>
          <span>Desconto do Cupom</span>
          <span>-R$ {appliedCoupon.descontoCalculado.toFixed(2).replace('.', ',')}</span>
        </div>
      )}

      {appliedCoupon && (
        <div className={`${styles.summaryRow} ${styles.subtotalAfterCouponRow}`}>
          <span>Subtotal (com cupom)</span>
          <span>R$ {subtotalAfterCoupon.toFixed(2).replace('.', ',')}</span>
        </div>
      )}

      {/* NOVO: Seção de Frete Condicional */}
      <div className={styles.shippingSection}>
        <h3>Entrega</h3>
        {allCartItemsAreDigital ? (
          // Exibe mensagem de entrega digital se todos os itens forem digitais
          <div className={styles.infoText}>
            Todos os itens são digitais. Entrega por e-mail e download na sua conta!
            <p className={styles.shippingOptionPrice} style={{textAlign: 'center', marginTop: '1rem'}}>R$ 0,00</p>
          </div>
        ) : (
          // Renderiza a lógica de frete normal para produtos físicos
          <>
            {isLoadingAddresses ? (
                <p className={styles.loadingText}>Carregando endereços...</p>
            ) : (
              <>
                {allUserAddresses && allUserAddresses.length > 0 ? (
                  <div className={styles.formGroup}>
                    <label htmlFor="address-option">Opções de Endereço:</label>
                    <select 
                      id="address-option" 
                      className={styles.selectInput}
                      value={selectedAddressOption} 
                      onChange={handleAddressOptionChange}
                    >
                      {allUserAddresses.some(addr => addr.principal) && (
                        <option value="principal">Endereço Principal ({allUserAddresses.find(addr => addr.principal).cep})</option>
                      )}
                      {!allUserAddresses.some(addr => addr.principal) && allUserAddresses[0] && (
                          <option value={allUserAddresses[0].id}>
                            {allUserAddresses[0].apelido || `${allUserAddresses[0].rua}, ${allUserAddresses[0].numero}`} ({allUserAddresses[0].cep})
                          </option>
                      )}
                      {allUserAddresses.filter(addr => !addr.principal && addr.id !== (allUserAddresses[0]?.id || null) ).map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.apelido || `${addr.rua}, ${addr.numero}`} ({addr.cep})
                        </option>
                      ))}
                      <option value="novo_cep">Outro CEP (Manual)</option>
                    </select>
                  </div>
                ) : (
                    <p className={styles.infoText}>Você não tem endereços cadastrados. Por favor, insira um CEP para calcular o frete.</p>
                )}

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

                {shippingError && <p className={styles.shippingError}>{shippingError}</p>}
                
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
                    !shippingError && <p className={styles.infoText}>Nenhuma opção de frete disponível para o CEP ou itens selecionados.</p>
                  )
                )}
              </>
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
        disabled={!selectedShippingMethod || isCalculatingShipping || cartItems.length === 0}
      >
        Ir para o Pagamento
      </motion.button>
    </div>
  );
};

export default CartSummary;

//teste