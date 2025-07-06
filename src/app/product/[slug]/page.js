// app/product/[slug]/page.js

import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import ProductGallery from '@/components/ProductPage/ProductGallery';
import ProductDetails from '@/components/ProductPage/ProductDetails';
import ProductDescription from '@/components/ProductPage/ProductDescription';
import RelatedProducts from '@/components/ProductPage/RelatedProducts';
import api from '@/services/api'; // Nosso serviço de API
import { notFound } from 'next/navigation'; // Para tratar produtos não encontrados

// Função para buscar dados da API
async function getProductData(slug) {
  try {
    // Busca o produto principal e os relacionados em paralelo
    const [productRes, relatedRes] = await Promise.all([
      api.get(`/produtos/${slug}`),
      api.get(`/produtos/${slug}/relacionados`)
    ]);

    const apiProduct = productRes.data;
    const apiRelated = relatedRes.data;

    // Mapeia os dados da API para o formato que os componentes esperam
    const product = {
      id: apiProduct.id,
      name: apiProduct.nome,
      images: apiProduct.imagens.map(url => ({ src: url, alt: apiProduct.nome })),
      variations: apiProduct.variacoes.map(v => ({
        id: v.id,
        name: v.nome,
        price: v.preco,
        stock: v.estoque,
      })),
      description: apiProduct.descricao,
    };

    const relatedProducts = apiRelated.map(p => ({
      id: p.id,
      slug: p.slug || p.id,
      name: p.nome,
      price: p.variacoes.length > 0 ? p.variacoes[0].preco : 0,
      imageSrc: p.imagens.length > 0 ? p.imagens[0] : 'https://placehold.co/400x400.png',
      isNew: false,
    }));

    return { product, relatedProducts };

  } catch (error) {
    // Se a API retornar um erro (ex: 404), a página de "Não Encontrado" será renderizada
    console.error("Erro ao buscar dados do produto:", error);
    if (error.response && error.response.status === 404) {
      notFound();
    }
    // Para outros erros, você pode mostrar uma página de erro personalizada
    // Por enquanto, vamos retornar nulo para que a página possa tratar
    return { product: null, relatedProducts: [] };
  }
}


export default async function ProductPage({ params }) {
  const { slug } = params;
  const { product, relatedProducts } = await getProductData(slug);

  if (!product) {
    return <div>Produto não encontrado ou ocorreu um erro ao carregar.</div>;
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Catálogo', href: '/catalog' },
    { label: product.name, href: null },
  ];

  return (
    <main style={{ padding: '0 1.5rem 4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          margin: '2rem 0'
      }}>
          <ProductGallery images={product.images} />
          {/* Passamos o produto inteiro para ProductDetails */}
          <ProductDetails product={product} /> 
          <ProductDescription product={product} /> 
      </div>
      
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}