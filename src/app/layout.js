// src/app/layout.js

import { Mali, Sacramento } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { FilterProvider } from '@/context/FilterContext'; // <-- 1. Importar o novo provider

// Configuração das fontes (sem alteração)
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
});

export const metadata = {
  title: 'DoodleDreams - Livros de Colorir Mágicos',
  description: 'Descubra a magia dos livros de colorir com DoodleDreams. Lúdico, Cinematográfico e Inspirador.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR"
          style={{
            '--font-mali-next': mali.style.fontFamily,
            '--font-magnolia-next': magnolia.style.fontFamily,
          }}
    >
      <body>
        <AuthProvider>
          <CartProvider>
            {/* 2. Envolver com o FilterProvider */}
            <FilterProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </FilterProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}