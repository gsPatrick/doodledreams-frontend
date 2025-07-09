// src/app/catalog/page.js

'use client';

import React, { useState, useEffect } from 'react';
// REMOVIDO: import { useSearchParams } from 'next/navigation';
import { useFilter } from '@/context/FilterContext'; // ALTERAÇÃO: Importar o contexto de filtro
import FilterSidebar from '@/components/CatalogPage/FilterSidebar';
import ProductGrid from '@/components/CatalogPage/ProductGrid';
import Breadcrumb from '@/components/SubscriptionPage/Breadcrumb';
import api from '@/services/api';
import styles from './CatalogPage.module.css';
import { BsFilterRight } from 'react-icons/bs';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ALTERAÇÃO: Usar o estado e a função do contexto global
  const { filters, setFilters } = useFilter();
  
  // REMOVIDO: O useState local para 'filters' foi removido.

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
          // O ID da categoria na sua API é um número, então garantimos que a string seja convertida
          // ou que a API aceite strings. Pelo seu backend, parece ser um número.
          // Vamos garantir que a API receba números.
          categorias: filters.categories.join(','), 
          ordenarPor: filters.sort,
          limit: filters.limit,
          page: filters.page,
        };
        // Se a busca de categorias não encontrar nada, não mandamos o param
        if (!params.categorias) delete params.categorias;

        const response = await api.get('/produtos', { params });
        const { produtos: apiProdutos, total, totalPages, currentPage } = response.data;
        
        const formattedProducts = apiProdutos.map(p => ({
            id: p.id,
            slug: p.slug || p.id,
            name: p.nome,
            price: p.variacoes && p.variacoes.length > 0 ? Number(p.variacoes[0].preco) : 0.00,
            imageSrc: p.imagens && p.imagens.length > 0 ? p.imagens[0] : 'https://placehold.co/400x400.png',
            isNew: false,
        }));

        setProducts(formattedProducts);
        setPagination({ total, totalPages, currentPage });

      } catch (err) {
        setError("Oops! Tivemos um problema para encontrar os rabiscos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filters]); // A busca agora reage a mudanças no filtro global

  const handlePageChange = (pageNumber) => {
    setFilters(prev => ({ ...prev, page: pageNumber }));
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Catálogo', href: null },
  ];

  return (
    <main style={{ padding: '0 1.5rem 4rem 1.5rem' }}>
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Nosso Catálogo de Sonhos</h1>
        <p className={styles.pageSubtitle}>Encontre o livro perfeito para colorir sua imaginação.</p>
      </div>

      <button className={styles.mobileFilterButton} onClick={() => setIsFilterOpen(true)}>
        <BsFilterRight size={24} />
        Filtrar e Ordenar
      </button>

      <div className={styles.catalogLayout}>
        <div className={styles.desktopSidebar}>
          {/* Passando o estado e a função do contexto para a sidebar */}
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>
        
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
        
        <ProductGrid products={products} isLoading={isLoading} error={error} />
      </div>

      {pagination.totalPages > 1 && !isLoading && !error && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
          <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}>Anterior</button>
          <span>Página {pagination.currentPage} de {pagination.totalPages}</span>
          <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}>Próxima</button>
        </div>
      )}
    </main>
  );
}