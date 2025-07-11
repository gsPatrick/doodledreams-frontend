'use client';

import React, { useState, useEffect } from 'react';
// import { api } from '@/services/api'; // Não precisamos mais da API por enquanto
import styles from './Dashboard.module.css';
import { BsBoxSeam, BsCashCoin, BsFillPeopleFill, BsGraphUp } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- DADOS MOCKADOS (FAKES) ---

const mockMetrics = {
  faturamentoHoje: 1250.75,
  vendasHoje: 15,
  clientesTotal: 289,
  produtosTotal: 74,
};

const mockSalesData = [
  { periodo: '2024-06-11', total: 800 },
  { periodo: '2024-06-12', total: 1100 },
  { periodo: '2024-06-13', total: 950 },
  { periodo: '2024-06-14', total: 1500 },
  { periodo: '2024-06-15', total: 1300 },
  { periodo: '2024-06-16', total: 1800 },
  { periodo: '2024-06-17', total: 1650 },
  // Adicione mais dias se quiser um gráfico mais longo
];

const mockTopProducts = [
  { id: 1, nome: 'A Aventura das Cores Perdidas', quantidade: 120, produto: { imagens: ['https://placehold.co/60x60/A8D0E6/343A40?text=A'] } },
  { id: 2, nome: 'O Jardim Secreto dos Sonhos', quantidade: 95, produto: { imagens: ['https://placehold.co/60x60/F6C5D5/343A40?text=J'] } },
  { id: 3, nome: 'Floresta Encantada para Colorir', quantidade: 88, produto: { imagens: ['https://placehold.co/60x60/BFE6C3/343A40?text=F'] } },
  { id: 4, nome: 'Meu Amigo Robô', quantidade: 72, produto: { imagens: ['https://placehold.co/60x60/CCC27A/343A40?text=R'] } },
  { id: 5, nome: 'Viagem ao Fundo do Mar', quantidade: 61, produto: { imagens: ['https://placehold.co/60x60/7A97CC/343A40?text=V'] } },
];

const mockRecentOrders = [
  { id: 1024, Usuario: { nome: 'Ana Clara' }, createdAt: new Date(), total: 89.90, status: 'pago' },
  { id: 1023, Usuario: { nome: 'Bruno Costa' }, createdAt: new Date(), total: 45.50, status: 'enviado' },
  { id: 1022, Usuario: { nome: 'Carla Dias' }, createdAt: new Date(), total: 112.00, status: 'pendente' },
  { id: 1021, Usuario: { nome: 'Diego Martins' }, createdAt: new Date(), total: 67.80, status: 'entregue' },
  { id: 1020, Usuario: { nome: 'Elisa Ferreira' }, createdAt: new Date(), total: 29.90, status: 'cancelado' },
];

// --- FIM DOS DADOS MOCKADOS ---

// Componente para os cards de estatísticas (sem alteração)
const StatCard = ({ icon, title, value, colorClass }) => (
  <div className={`${styles.statCard} ${styles[colorClass]}`}>
    <div className={styles.cardIcon}>{icon}</div>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardValue}>{value}</p>
    </div>
  </div>
);

// Componente para o gráfico de vendas (sem alteração)
const SalesChart = ({ data }) => {
    const chartData = data.map(item => ({
      name: new Date(item.periodo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      Faturamento: item.total
    }));
    return (
        <div className={styles.chartContainer}>
            <h3 className={styles.sectionTitle}>Faturamento Recente</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--doodle-input-border)" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--doodle-placeholder-text)', fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `R$${value}`} tick={{ fill: 'var(--doodle-placeholder-text)', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(144, 122, 204, 0.1)' }} contentStyle={{ background: 'var(--doodle-white)', border: '1px solid var(--doodle-input-border)', borderRadius: '12px' }}/>
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="Faturamento" fill="var(--doodle-purple-soft)" barSize={20} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Página principal do Dashboard
export default function DashboardPage() {
  // Estados agora são inicializados com os dados mockados
  const [metrics, setMetrics] = useState(mockMetrics);
  const [salesData, setSalesData] = useState(mockSalesData);
  const [topProducts, setTopProducts] = useState(mockTopProducts);
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders);
  const [loading, setLoading] = useState(false); // Inicia como false
  const [error, setError] = useState(null);

  // O useEffect que chamava a API foi removido.
  // Se quiser simular um carregamento, pode usar um setTimeout:
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setMetrics(mockMetrics);
      setSalesData(mockSalesData);
      setTopProducts(mockTopProducts);
      setRecentOrders(mockRecentOrders);
      setLoading(false);
    }, 1000); // Simula 1 segundo de carregamento
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className={styles.statusContainer}>Carregando sua loja mágica...</div>;
  }

  if (error) {
    return <div className={`${styles.statusContainer} ${styles.error}`}>{error}</div>;
  }

  return (
    <main className={styles.dashboardContainer}>
      <h1 className={styles.mainTitle}>Visão Geral da Loja</h1>
      
      <div className={styles.statsGrid}>
        <StatCard 
          icon={<BsCashCoin />} 
          title="Faturamento Hoje" 
          value={`R$ ${metrics?.faturamentoHoje?.toFixed(2).replace('.', ',') || '0,00'}`}
          colorClass="purple"
        />
        <StatCard 
          icon={<BsGraphUp />} 
          title="Vendas Hoje" 
          value={metrics?.vendasHoje || 0}
          colorClass="blue"
        />
        <StatCard 
          icon={<BsFillPeopleFill />} 
          title="Total de Clientes" 
          value={metrics?.clientesTotal || 0}
          colorClass="yellow"
        />
        <StatCard 
          icon={<BsBoxSeam />} 
          title="Produtos Ativos" 
          value={metrics?.produtosTotal || 0}
          colorClass="green"
        />
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <SalesChart data={salesData} />
          
          <div className={styles.listContainer}>
             <h3 className={styles.sectionTitle}>Últimos Pedidos</h3>
             <div className={styles.tableWrapper}>
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.Usuario.nome}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td>R$ {order.total.toFixed(2).replace('.', ',')}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
        </div>
        
        <aside className={styles.sidebarContent}>
           <div className={styles.listContainer}>
              <h3 className={styles.sectionTitle}>Produtos Mais Vendidos</h3>
              <ul className={styles.topProductsList}>
                 {topProducts.map(item => (
                    <li key={item.id} className={styles.productItem}>
                        <img 
                          src={item.produto?.imagens?.[0] || 'https://placehold.co/60x60.png'} 
                          alt={item.nome} 
                          className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                            <p className={styles.productName}>{item.nome}</p>
                            <span className={styles.productSales}>{item.quantidade} vendidos</span>
                        </div>
                    </li>
                 ))}
              </ul>
           </div>
        </aside>
      </div>
    </main>
  );
}