import Script from 'next/script';
import { Mali, Sacramento } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { FilterProvider } from '@/context/FilterContext';
import CouponPopup from '@/components/CouponPopup/CouponPopup';

const mali = Mali({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-mali-next',
  display: 'swap',
});

const magnolia = Sacramento({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-magnolia-next',
  display: 'swap',
  // display: swap ajuda com desempenho e estabilidade de fontes no carregamento
});

export const metadata = {
  title: 'DoodleDreams - Livros de Colorir Mágicos',
  description: 'Descubra a magia dos livros de colorir com DoodleDreams. Lúdico, Cinematográfico e Inspirador.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      style={{
        '--font-mali-next': mali.style.fontFamily,
        '--font-magnolia-next': magnolia.style.fontFamily,
      }}
    >
      <head>
        {/* Meta Pixel Script */}
        <Script id="meta-pixel-dd" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1469352720999754');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1469352720999754&ev=PageView&noscript=1"
          />
        </noscript>

        <AuthProvider>
          <CartProvider>
            <FilterProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <CouponPopup />
            </FilterProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
