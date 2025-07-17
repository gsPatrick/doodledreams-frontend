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

  // --- LÓGICA DE ENDEREÇO PADRÃO SIMPLIFICADA ---
  // Determina o valor padrão para o select de endereço
  const getDefaultAddressOption = () => {
    if (isLoadingAddresses || !allUserAddresses || allUserAddresses.length === 0) {
      return 'novo_cep'; // Se não há endereços, o padrão é inserir CEP manual
    }
    const principal = allUserAddresses.find(addr => addr.principal);
    if (principal) {
      return principal.id; // Usa o ID do endereço principal como padrão
    }
    return allUserAddresses[0].id; // Senão, usa o ID do primeiro endereço da lista
  };

  const [subtotal, setSubtotal] = useState(0);
  const [selectedAddressOption, setSelectedAddressOption] = useState(getDefaultAddressOption);
  const [manualCep, setManualCep] = useState('');
  
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const allCartItemsAreDigital = cartItems.every(item => item.variation.digital === true);

  // Calcula o subtotal e limpa o cupom quando o carrinho muda
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
  
  // Atualiza a seleção de endereço padrão quando os endereços são carregados
  useEffect(() => {
    if (!isLoadingAddresses) {
      setSelectedAddressOption(getDefaultAddressOption());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUserAddresses, isLoadingAddresses]);

  // Função para calcular o frete
  const calculateShipping = useCallback(async (targetCep) => {
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
      
      // Com o novo backend, a resposta será sempre bem-sucedida (200),
      // mesmo que o ViaCEP falhe. O catch aqui só pegará falhas de rede ou 500.
      const validOptions = response.data.filter(opt => !opt.error);
      setShippingOptions(validOptions);
      
      if (validOptions.length > 0) {
        setSelectedShippingMethod(validOptions[0]);
      } else {
        setShippingError('Não foi encontrada nenhuma opção de frete para este CEP.');
      }
    } catch (err) {
      console.error("Erro ao calcular frete:", err.response?.data?.erro || err.message);
      setShippingError(err.response?.data?.erro || 'Não foi possível calcular o frete para este CEP.');
    } finally {
      setIsCalculatingShipping(false);
    }
  }, [allCartItemsAreDigital, cartItems, selectedAddressOption, manualCep]);

  // Efeito principal para recalcular o frete automaticamente
  useEffect(() => {
    if (allCartItemsAreDigital) {
        setSelectedShippingMethod(DIGITAL_DELIVERY_METHOD);
        setShippingOptions([DIGITAL_DELIVERY_METHOD]);
        setShippingError('');
        setIsCalculatingShipping(false);
        return;
    }

    if (isLoadingAddresses || cartItems.length === 0) {
      setShippingOptions([]);
      setSelectedShippingMethod(null);
      return;
    }

    let targetCepToUse = '';
    
    if (selectedAddressOption === 'novo_cep') {
      targetCepToUse = manualCep;
    } else { 
      const selectedAddr = allUserAddresses?.find(addr => addr.id.toString() === selectedAddressOption.toString());
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

  const handleAddressOptionChange = (e) => {
    const value = e.target.value;
    setSelectedAddressOption(value);
    setManualCep('');
    setSelectedShippingMethod(null);
    setShippingOptions([]);
    setShippingError('');
  };

  const handleManualCepChange = (e) => {
    setManualCep(e.target.value.replace(/\D/g, ''));
    setSelectedShippingMethod(null);
    setShippingOptions([]);
    setShippingError('');
  };

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
      setCouponError(err.response?.data?.erro || 'Não foi possível aplicar o cupom.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleProceedToCheckout = () => {
    // Para produtos físicos, exige método de frete selecionado
    if (!allCartItemsAreDigital && !selectedShippingMethod) {
        return; // Botão já está desabilitado, mas é uma segurança extra
    }

    let finalCep = null;
    let finalShippingMethod = selectedShippingMethod;

    if (allCartItemsAreDigital) {
        finalShippingMethod = DIGITAL_DELIVERY_METHOD;
    } else if (selectedAddressOption === 'novo_cep') {
        finalCep = manualCep;
    } else {
        const selectedAddr = allUserAddresses?.find(addr => addr.id.toString() === selectedAddressOption.toString());
        finalCep = selectedAddr ? selectedAddr.cep : null;
    }

    localStorage.setItem('checkout_data', JSON.stringify({
        shippingMethod: finalShippingMethod,
        cep: finalCep,
        coupon: appliedCoupon,
        isDigitalOrder: allCartItemsAreDigital,
    }));
    router.push('/checkout');
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
            <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className={styles.removeCouponButton}>Remover</button>
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
            <motion.button className={styles.applyCouponButton} onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
              {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
            </motion.button>
          </div>
        )}
        {couponError && <p className={styles.couponError}>{couponError}</p>}
      </div>
      
      {/* Exibição condicional do frete */}
      <div className={styles.shippingSection}>
        <h3>Entrega</h3>
        {allCartItemsAreDigital ? (
          <div className={styles.infoText}>
            Todos os itens são digitais. Entrega por e-mail e download na sua conta!
            <p className={styles.shippingOptionPrice} style={{textAlign: 'center', marginTop: '1rem'}}>R$ 0,00</p>
          </div>
        ) : (
          <>
            {isLoadingAddresses ? (
                <p className={styles.loadingText}>Carregando endereços...</p>
            ) : (
              <>
                {allUserAddresses && allUserAddresses.length > 0 ? (
                  <div className={styles.formGroup}>
                    <label htmlFor="address-option">Calcular frete para:</label>
                    <select 
                      id="address-option" 
                      className={styles.selectInput}
                      value={selectedAddressOption} 
                      onChange={handleAddressOptionChange}
                    >
                      {/* --- RENDERIZAÇÃO DO SELECT SIMPLIFICADA --- */}
                      {allUserAddresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {`${addr.apelido || addr.rua} (${addr.cep})`} {addr.principal ? ' - Principal' : ''}
                        </option>
                      ))}
                      <option value="novo_cep">Outro CEP (Manual)</option>
                    </select>
                  </div>
                ) : (
                    <p className={styles.infoText}>Você não tem endereços. Insira um CEP para calcular.</p>
                )}

                {selectedAddressOption === 'novo_cep' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="manual-cep">Digite o CEP:</label>
                    <input type="text" id="manual-cep" className={styles.textInput} placeholder="00000-000" value={manualCep} onChange={handleManualCepChange} maxLength={9} />
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
                          <input type="radio" name="shippingMethod" value={option.id} checked={selectedShippingMethod?.id === option.id} onChange={() => setSelectedShippingMethod(option)} className={styles.shippingRadio} />
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
                    !shippingError && selectedAddressOption && <p className={styles.infoText}>Nenhuma opção de frete para o CEP selecionado.</p>
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
        disabled={(!selectedShippingMethod && !allCartItemsAreDigital) || isCalculatingShipping || cartItems.length === 0}
      >
        Ir para o Pagamento
      </motion.button>
    </div>
  );
};

export default CartSummary;