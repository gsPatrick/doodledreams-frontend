import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import SubscriptionHero from '@/components/SubscriptionPage/SubscriptionHero';
import FeaturesIncluded from '@/components/SubscriptionPage/FeaturesIncluded';
import PricingTiers from '@/components/SubscriptionPage/PricingTiers';
import FaqSection from '@/components/SubscriptionPage/FaqSection';

// Esta é a definição da página. Ela é um Server Component.
// Ela renderiza outros componentes, alguns dos quais são Client Components.
export default function SubscriptionPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Planos de Assinatura', href: null },
  ];

  return (
    // A tag <main> é importante para semântica e acessibilidade.
    // O Header e Footer serão aplicados automaticamente pelo RootLayout.
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <SubscriptionHero />
      <FeaturesIncluded />
      <PricingTiers />
      <FaqSection />
    </main>
  );
}