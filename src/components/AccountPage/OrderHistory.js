'use client';

import React from 'react';
import styles from './AccountPage.module.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsBoxSeam } from 'react-icons/bs';

const OrderHistory = ({ orders }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'entregue':
      case 'concluido': // Adicionado para cobrir mais casos
        return styles.statusDelivered;
      case 'processando':
      case 'pago': // Adicionado
        return styles.statusProcessing;
      case 'cancelado':
        return styles.statusCancelled; // Você precisará criar este estilo
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.contentTitle}>Minhas Compras</h2>
      <div className={styles.orderList}>
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <h3>Pedido #{order.id}</h3>
                  <p>Realizado em: {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>
              <div className={styles.orderItems}>
                {order.itens.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <Image 
                        src={item.produto?.imagemUrl || 'https://placehold.co/50x50.png'} 
                        alt={item.nome} 
                        width={50} 
                        height={50} 
                    />
                    <span>{item.nome}</span>
                  </div>
                ))}
              </div>
              <div className={styles.orderTotal}>
                <strong>Total: R$ {Number(order.total).toFixed(2).replace('.', ',')}</strong>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyStateContainer}>
            <BsBoxSeam className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>Sua estante de aventuras está vazia</h3>
            <p className={styles.emptyStateText}>Quando você fizer uma compra, seus pedidos mágicos aparecerão aqui.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderHistory;