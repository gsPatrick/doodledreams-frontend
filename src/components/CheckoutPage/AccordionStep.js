'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CheckoutPage.module.css';
import { HiChevronDown, HiCheckCircle } from 'react-icons/hi2';

const AccordionStep = ({ stepNumber, title, isOpen, isCompleted, onToggle, children }) => {
  return (
    <div className={`${styles.accordionItem} ${isCompleted ? styles.completed : ''}`}>
      <motion.button
        className={styles.accordionHeader}
        onClick={onToggle}
      >
        <div className={styles.stepTitle}>
          <span className={styles.stepNumber}>
            {isCompleted ? <HiCheckCircle /> : stepNumber}
          </span>
          {title}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <HiChevronDown />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.accordionContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '1.5rem', transition: { duration: 0.4, ease: 'easeInOut' } }}
            exit={{ height: 0, opacity: 0, marginTop: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionStep;