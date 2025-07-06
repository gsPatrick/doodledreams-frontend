import React from 'react';
import styles from '@/components/ContactPage/ContactPage.module.css';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';

// Importando os componentes (agora apenas 2)
import ContactHero from '@/components/ContactPage/ContactHero';
import ContactChannels from '@/components/ContactPage/ContactChannels';

export default function ContactPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Contato', href: null },
  ];

  return (
    <main className={styles.mainContainer}>
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Componente Hero com a mensagem impactante */}
      <ContactHero />

      {/* Componente com os canais de contato */}
      <ContactChannels />
    </main>
  );
}