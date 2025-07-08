// src/app/[slug]/page.js

// CORREÇÃO: Importando o novo arquivo de estilo
import styles from './ProductPage.module.css'; 

import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import ProductGallery from '@/components/ProductPage/ProductGallery';
import ProductDetails from '@/components/ProductPage/ProductDetails';
import ProductDescription from '@/components/ProductPage/ProductDescription';
import RelatedProducts from '@/components/ProductPage/RelatedProducts';
import api from '@/services/api';
import { notFound } from 'next/navigation';

async function getProductData(slug) {
  try {
    const productRes = await api.get(`/produtos/${slug}`);
    
    if (!productRes.data || Object.keys(productRes.data).length === 0) {
        notFound();
    }
    
    const apiProduct = productRes.data;

    let apiRelated = [];
    try {
        if (apiProduct.id) {
            const relatedRes = await api.get(`/produtos/${apiProduct.id}/relacionados`);
            apiRelated = relatedRes.data;
        }
    } catch (relatedError) {
        console.warn(`Aviso: Falha ao buscar produtos relacionados para ID ${apiProduct.id}.`);
    }

    const product = {
      id: apiProduct.id,
      name: apiProduct.nome || "Produto sem nome",
      description: apiProduct.descricao || "Descrição não disponível.",
      variations: (apiProduct.variacoes || []).map(v => ({
        id: v.id,
        name: v.nome || "Variação",
        price: Number(v.preco) || 0,
        stock: v.estoque || 0,
      })),
      arquivoProdutos: apiProduct.ArquivoProdutos || [], 
      slug: apiProduct.slug,
      price: apiProduct.variacoes && apiProduct.variacoes.length > 0 ? Number(apiProduct.variacoes[0].preco) : 0.00,
      imageSrc: apiProduct.ArquivoProdutos && apiProduct.ArquivoProdutos.find(a => a.tipo === 'imagem' && a.principal)
                ? apiProduct.ArquivoProdutos.find(a => a.tipo === 'imagem' && a.principal).url
                : (apiProduct.imagens && apiProduct.imagens.length > 0 ? apiProduct.imagens[0] : 'https://placehold.co/400x400.png'),
      isNew: Math.random() > 0.5,
      buttonColor: Math.random() > 0.5 ? 'purple' : 'blue',
    };

    const relatedProducts = (apiRelated || []).map(p => ({
      id: p.id,
      slug: p.slug || p.id,
      name: p.nome || "Produto relacionado",
      price: p.variacoes && p.variacoes.length > 0 ? Number(p.variacoes[0].preco) : 0.00,
      imageSrc: p.ArquivoProdutos && p.ArquivoProdutos.find(a => a.tipo === 'imagem' && a.principal)
                ? p.ArquivoProdutos.find(a => a.tipo === 'imagem' && a.principal).url
                : (p.imagens && p.imagens.length > 0 ? p.imagens[0] : 'https://placehold.co/400x400.png'),
      isNew: Math.random() > 0.5,
      buttonColor: Math.random() > 0.5 ? 'purple' : 'blue',
    }));

    return { product, relatedProducts };

  } catch (error) {
    if (error.response && error.response.status === 404) {
      notFound();
    }
    return { product: null, relatedProducts: [] };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const { product, relatedProducts } = await getProductData(slug);

  if (!product) {
    return (
        <main style={{ padding: '10rem 1.5rem', textAlign: 'center' }}>
            <h1>Oops! Rabisco não encontrado.</h1>
            <p>Não conseguimos encontrar o produto que você está procurando.</p>
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
      
      {/* CORREÇÃO: Removido o estilo inline e aplicada a classe do CSS module */}
      <div className={styles.productPageGrid}>
          <ProductGallery arquivoProdutos={product.arquivoProdutos} /> 
          <ProductDetails product={product} /> 
          <ProductDescription product={product} /> 
      </div>
      
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}