'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from '@/components/CatalogPage/FilterSidebar';
import ProductGrid from '@/components/CatalogPage/ProductGrid';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import api from '@/services/api';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => {
    const categoryFromUrl = searchParams.get('category');
    const sortFromUrl = searchParams.get('sort');
    return {
      categories: categoryFromUrl ? [categoryFromUrl] : [],
      price: { min: 0, max: 100 },
      sort: sortFromUrl || 'lancamentos',
    };
  });

  useEffect(() => {
    document.body.classList.add('catalog-background');
    return () => {
      document.body.classList.remove('catalog-background');
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = {
          categorias: filters.categories.join(','),
          ordenarPor: filters.sort,
        };

        const response = await api.get('/produtos', { params });
        const { produtos: apiProdutos, total, totalPages, currentPage } = response.data;
        
        const formattedProducts = apiProdutos.map(p => ({
            id: p.id,
            slug: p.slug || p.id,
            name: p.nome,
            // CORREÇÃO APLICADA: Convertendo para número
            price: p.variacoes && p.variacoes.length > 0 ? Number(p.variacoes[0].preco) : 0.00,
            imageSrc: p.imagens && p.imagens.length > 0 ? p.imagens[0] : 'https://placehold.co/400x400.png',
            isNew: false, 
        }));

        setProducts(formattedProducts);
        setPagination({ total, totalPages, currentPage });

      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Oops! Tivemos um problema para encontrar os rabiscos. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Catálogo', href: null },
  ];

  return (
    <main style={{ padding: '0 1.5rem 4rem 1.5rem' }}>
      <Breadcrumb items={breadcrumbItems} />
      <div style={{ maxWidth: 1400, margin: '2rem auto', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-mali-next)', fontSize: '3rem', color: 'var(--doodle-dark-grey)'}}>Nosso Catálogo de Sonhos</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--doodle-placeholder-text)'}}>Encontre o livro perfeito para colorir sua imaginação.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <ProductGrid products={products} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
}