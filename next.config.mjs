/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Pode manter, sem problemas.
  images: {
    remotePatterns: [
      // Configuração para placehold.co (está correta)
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Configuração para o seu backend (corrigida)
      {
        protocol: 'https',
        hostname: 'n8n-doodledreamsbackend.r954jc.easypanel.host',
        port: '',
        // CORREÇÃO AQUI: Permite o acesso a /uploads/ e qualquer coisa dentro dele.
        pathname: '/uploads/**', 
      },
    ],
  },
};

export default nextConfig;