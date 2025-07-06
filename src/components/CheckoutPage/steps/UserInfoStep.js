'use client';

import React, { useState } from 'react';
import styles from '../CheckoutPage.module.css';
import { motion } from 'framer-motion';

const UserInfoStep = ({ onNext }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '', name: '', address: '', city: '', state: '', zip: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.loginToggle}>
        <p>Caso sejá um usuario novo crie uma conta ou faça login</p>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Criar conta' : 'Faça Login'}
        </button>
      </div>

      {isLogin ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={styles.formGroup}>
            <label htmlFor="login-email">Email</label>
            <input type="email" id="login-email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="login-password">Senha</label>
            <input type="password" id="login-password" required />
          </div>
          <button type="button" className={styles.loginButton}>Entrar</button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email para contato</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="seuemail@exemplo.com" />
          </div>
          <h4 className={styles.subheading}>Endereço de Entrega</h4>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="name">Nome Completo</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="address">Endereço (Rua, Número, Bairro)</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city">Cidade</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state">Estado (UF)</label>
              <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} maxLength={2} required />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="zip">CEP</label>
              <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} maxLength={9} placeholder="00000-000" required />
            </div>
          </div>
        </motion.div>
      )}

      <div className={styles.stepActions}>
        <button type="submit" className={styles.nextButton} disabled={isLogin}>
          Continuar para o Frete
        </button>
      </div>
    </form>
  );
};

export default UserInfoStep;