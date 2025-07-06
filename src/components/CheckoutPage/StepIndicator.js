'use client';

import React from 'react';
import styles from './CheckoutPage.module.css';
import { BsPerson, BsTruck, BsCreditCard } from 'react-icons/bs';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Informações', icon: <BsPerson /> },
    { number: 2, label: 'Frete', icon: <BsTruck /> },
    { number: 3, label: 'Pagamento', icon: <BsCreditCard /> },
  ];

  return (
    <div className={styles.stepIndicatorContainer}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div
            className={`${styles.stepNode} ${currentStep >= step.number ? styles.active : ''}`}
          >
            <div className={styles.stepIcon}>{step.icon}</div>
            <span className={styles.stepLabel}>{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`${styles.stepConnector} ${currentStep > step.number ? styles.active : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;