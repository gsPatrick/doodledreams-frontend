'use client';

import React, { useState, useEffect } from 'react';
import styles from './AccountPage.module.css';
import { motion } from 'framer-motion';
import api from '@/services/api';

const AccountDetails = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({ nome: '', email: '' });
  const [passwordData, setPasswordData] = useState({ senhaAtual: '', novaSenha: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ nome: user.nome, email: user.email });
    }
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = { ...formData };
      if (passwordData.novaSenha && passwordData.senhaAtual) {
        payload.novaSenha = passwordData.novaSenha;
        payload.senhaAtual = passwordData.senhaAtual;
      }
      
      const response = await api.put('/usuarios/perfil', payload);
      onProfileUpdate(response.data.usuario); // Atualiza o estado no componente pai
      setSuccess('Dados atualizados com sucesso!');
      setPasswordData({ senhaAtual: '', novaSenha: '' }); // Limpa campos de senha
    } catch (err) {
      setError(err.response?.data?.erro || 'Ocorreu um erro ao salvar os dados.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.contentTitle}>Meus Dados</h2>
      <form className={styles.detailsForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome Completo</label>
          <input
            type="text" id="nome" name="nome"
            value={formData.nome} onChange={handleFormChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email" id="email" name="email"
            value={formData.email} onChange={handleFormChange}
          />
        </div>
        <hr className={styles.formDivider} />
        <p className={styles.contentSubtitle}>Deixe em branco se não quiser alterar a senha.</p>
        <div className={styles.formGroup}>
          <label htmlFor="senhaAtual">Senha Atual</label>
          <input
            type="password" id="senhaAtual" name="senhaAtual"
            value={passwordData.senhaAtual} onChange={handlePasswordChange}
            placeholder="Sua senha atual"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="novaSenha">Nova Senha</label>
          <input
            type="password" id="novaSenha" name="novaSenha"
            value={passwordData.novaSenha} onChange={handlePasswordChange}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AccountDetails;