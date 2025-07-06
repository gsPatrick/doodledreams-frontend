'use client';

import React, { useState, useEffect } from 'react';
import styles from '../CheckoutPage.module.css';
import { BsBoxSeam } from 'react-icons/bs';

// Simulação de resposta de API de frete
const mockShippingAPI = (zip) => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!zip || zip.length < 8) {
        resolve([]);
        return;
      }
      resolve([
        { id: 'pac', name: 'Entrega PAC', deliveryTime: '7-10 dias úteis', price: 18.50 },
        { id: 'sedex', name: 'Entrega Sedex', deliveryTime: '2-4 dias úteis', price: 32.00 },
      ]);
    }, 1200);
  });
};


const ShippingStep = ({ onNext, onPrev, userZip }) => {
  const [cep, setCep] = useState(userZip || '');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchShipping = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setShippingOptions([]);
    const options = await mockShippingAPI(cep);
    setShippingOptions(options);
    setIsLoading(false);
  };
  
  useEffect(() => {
      if(userZip) {
          handleFetchShipping();
      }
  }, [userZip]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <form onSubmit={handleFetchShipping} className={styles.cepForm}>
        <div className={styles.formGroup}>
          <label htmlFor="cep">Calcular Frete (CEP)</label>
          <div className={styles.inputWithButton}>
            <input 
              type="text" 
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="00000-000"
            />
            <button type="submit" disabled={isLoading}>{isLoading ? '...' : 'Buscar'}</button>
          </div>
        </div>
      </form>

      {shippingOptions.length > 0 && (
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
                  <span>{option.deliveryTime}</span>
                </div>
              </div>
              <span className={styles.shippingPrice}>R$ {option.price.toFixed(2).replace('.',',')}</span>
            </label>
          ))}
        </div>
      )}
      
      <div className={styles.stepActions}>
        <button onClick={onPrev} className={styles.prevButton}>Voltar</button>
        <button onClick={() => onNext(selectedOption)} className={styles.nextButton} disabled={!selectedOption}>
          Ir para Pagamento
        </button>
      </div>
    </div>
  );
};

export default ShippingStep;