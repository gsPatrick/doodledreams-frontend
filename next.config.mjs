/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pode haver outras configurações aqui, como reactStrictMode.
  // Adicione ou modifique a propriedade 'images' abaixo:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**', // Permite qualquer caminho dentro desse hostname
      },
      // Você pode adicionar outros domínios aqui no futuro, se precisar.
    ],
  },
};

// Use export default em vez de module.exports
export default nextConfig;