// src/app/page.js

import HeroSection from '@/components/Hero/HeroSection';
import TrustBar from '@/components/TrustBar/TrustBar'; 
import MercadoPagoBanner from '@/components/MercadoPagoBanner/MercadoPagoBanner'; // <-- NOVO COMPONENTE
import CollectionsSection from '@/components/Collections/CollectionsSection';
import LatestProductsSection from '@/components/LatestProducts/LatestProductsSection';
import TestimonialsSection from '@/components/Testimonials/TestimonialsSection';
import SubscriptionClubSection from '@/components/SubscriptionClub/SubscriptionClubSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      {/* --- ADICIONADO AQUI --- */}
      <MercadoPagoBanner />
      {/* --- FIM DA ADIÇÃO --- */}
      <CollectionsSection />
      <LatestProductsSection />
      <SubscriptionClubSection />
    </main>
  );
}