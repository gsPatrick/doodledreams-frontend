'use client';

import React from 'react';
import styles from './AccountPage.module.css';
import { motion } from 'framer-motion';
import { BsPencil, BsTrash, BsPlusCircleDotted, BsHouseHeart } from 'react-icons/bs';

const containerVariants = { /* ... */ };
const itemVariants = { /* ... */ };

const AddressManager = ({ addresses }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className={styles.contentTitle}>Meus Endereços</h2>
      <p className={styles.contentSubtitle}>
        Gerencie seus endereços de entrega para uma finalização de compra mais rápida e mágica.
      </p>
      
      {addresses && addresses.length > 0 ? (
        <div className={styles.addressList}>
            {addresses.map((address) => (
            <motion.div key={address.id} className={styles.addressCard} variants={itemVariants}>
                <div className={styles.addressContent}>
                <div className={styles.addressAlias}>
                    {address.apelido || 'Endereço'}
                    {address.principal && <span className={styles.primaryBadge}>Principal</span>}
                </div>
                <p>
                    {address.rua}, {address.numero}<br />
                    {address.cidade}, {address.estado}<br />
                    CEP: {address.cep}
                </p>
                </div>
                <div className={styles.addressActions}>
                <button aria-label="Editar endereço"><BsPencil /></button>
                <button aria-label="Remover endereço"><BsTrash /></button>
                </div>
            </motion.div>
            ))}
            <motion.button className={styles.addAddressButton} variants={itemVariants}>
            <BsPlusCircleDotted />
            <span>Adicionar Novo Endereço</span>
            </motion.button>
        </div>
      ) : (
        <div className={styles.emptyStateContainer}>
            <BsHouseHeart className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>Nenhum endereço mágico cadastrado</h3>
            <p className={styles.emptyStateText}>Adicione um endereço para que possamos enviar suas aventuras coloridas!</p>
            <motion.button className={styles.addAddressButton} style={{marginTop: '2rem'}}>
                <BsPlusCircleDotted />
                <span>Adicionar Primeiro Endereço</span>
            </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default AddressManager;