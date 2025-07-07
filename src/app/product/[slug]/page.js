import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import ProductGallery from '@/components/ProductPage/ProductGallery';
import ProductDetails from '@/components/ProductPage/ProductDetails';
import ProductDescription from '@/components/ProductPage/ProductDescription';
import RelatedProducts from '@/components/ProductPage/RelatedProducts';
import api from '@/services/api';
import { notFound } from 'next/navigation';

async function getProductData(slug) {
  try {
    console.log(`[SERVER] Iniciando busca para slug: ${slug}`);
    
    // A Promise.all é eficiente, mas vamos separar para um debug mais claro.
    const productRes = await api.get(`/produtos/${slug}`);
    console.log("[SERVER] Resposta da API de produto principal recebida.");
    
    // Validação crucial: Se a API respondeu 200 mas sem dados, trate como não encontrado.
    if (!productRes.data || Object.keys(productRes.data).length === 0) {
        console.warn(`[SERVER] API retornou sucesso para o slug '${slug}', mas os dados estão vazios.`);
        notFound();
    }
    
    const apiProduct = productRes.data;

    // Busca de relacionados é secundária, então pode falhar sem quebrar a página.
    let apiRelated = [];
    try {
        const relatedRes = await api.get(`/produtos/${apiProduct.id}/relacionados`);
        apiRelated = relatedRes.data;
        console.log("[SERVER] Resposta da API de produtos relacionados recebida.");
    } catch (relatedError) {
        console.warn(`[SERVER] Aviso: Falha ao buscar produtos relacionados para ID ${apiProduct.id}. A página será renderizada sem eles.`);
    }

    // --- FORMATAÇÃO DE DADOS SEGURA ---
    console.log("[SERVER] Iniciando formatação dos dados...");
    
    const product = {
      id: apiProduct.id,
      name: apiProduct.nome || "Produto sem nome",
      images: (apiProduct.imagens || []).map(url => ({ src: url, alt: apiProduct.nome || "Imagem do produto" })),
      variations: (apiProduct.variacoes || []).map(v => ({
        id: v.id,
        name: v.nome || "Variação",
        price: Number(v.preco) || 0,
        stock: v.estoque || 0,
      })),
      description: apiProduct.descricao || "Descrição não disponível.",
    };

    const relatedProducts = (apiRelated || []).map(p => ({
      id: p.id,
      slug: p.slug || p.id,
      name: p.nome || "Produto relacionado",
      price: p.variacoes && p.variacoes.length > 0 ? Number(p.variacoes[0].preco) : 0.00,
      imageSrc: p.imagens && p.imagens.length > 0 ? p.imagens[0] : 'https://placehold.co/400x400.png',
    }));

    console.log("[SERVER] Formatação concluída. Retornando dados para o componente.");
    return { product, relatedProducts };

  } catch (error) {
    console.error(`[SERVER] ERRO CRÍTICO em getProductData para slug '${slug}':`, error.message);
    if (error.response) {
      console.error("[SERVER] Detalhes do erro da API:", error.response.status, error.response.data);
      if (error.response.status === 404) {
        notFound();
      }
    }
    return { product: null, relatedProducts: [] };
  }
}


export default async function ProductPage({ params }) {
  const { slug } = params;
  
  // O console.log inicial vai aparecer no terminal do servidor Next.js
  console.log(`[SERVER] Renderizando a página para o slug: ${slug}`);

  const { product, relatedProducts } = await getProductData(slug);

  if (!product) {
    return (
        <main style={{ padding: '10rem 1.5rem', textAlign: 'center' }}>
            <h1>Oops! Rabisco não encontrado.</h1>
            <p>Não conseguimos encontrar o produto que você está procurando. Ele pode ter se escondido!</p>
        </main>
    );
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
          <ProductDetails product={product} /> 
          <ProductDescription product={product} /> 
      </div>
      
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}