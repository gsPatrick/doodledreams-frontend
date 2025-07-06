// Importe os componentes necessários
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import AboutHero from '@/components/AboutPage/AboutHero';
import OurMission from '@/components/AboutPage/OurMission';
import ComfortSection from '@/components/AboutPage/ComfortSection';
import Timeline from '@/components/AboutPage/Timeline';
import FinalCta from '@/components/AboutPage/FinalCta'; // <-- 1. Importe o novo componente
import OpeningStatement from '@/components/AboutPage/OpeningStatement'; // <-- 1. Importe o novo componente

// REMOVIDO: A definição const FinalCta = () => { ... } foi movida para seu próprio arquivo.

export default function AboutPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Sobre Nós', href: null },
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
            <OpeningStatement /> {/* <-- 2. Adicione como a primeira seção */}

      <AboutHero />
      <ComfortSection />
      <OurMission />
      <FinalCta /> {/* <-- 2. Use o componente importado aqui */}
    </main>
  );
}