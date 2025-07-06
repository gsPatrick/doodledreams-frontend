import HeroSection from '@/components/Hero/HeroSection';
import CollectionsSection from '@/components/Collections/CollectionsSection';
import LatestProductsSection from '@/components/LatestProducts/LatestProductsSection';
import SubscriptionClubSection from '@/components/SubscriptionClub/SubscriptionClubSection'; // Importe a seção de Assinatura

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CollectionsSection />
      <LatestProductsSection />
      <SubscriptionClubSection /> {/* Adicione a seção do Clube de Assinatura aqui */}
      {/* Mantenha outros conteúdos da página aqui se houver */}
    </main>
  );
}