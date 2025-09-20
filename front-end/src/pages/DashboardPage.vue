<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div ref="headerRef" class="row q-mb-md">
      <div class="col-12">
        <h1 class="text-h5 text-weight-bold text-primary q-mb-xs">Dashboard</h1>
        <p class="text-body2 text-grey-7">Visão geral do seu negócio</p>
      </div>
    </div>

    <div class="row q-gutter-md">
      <!-- Cards de Estatísticas -->
      <div class="col-12">
        <div class="row q-col-gutter-xs q-row-gutter-xs">
          <div class="col-6 col-sm-3">
            <q-card ref="card1" class="bg-primary text-white shadow-sm stat-card">
              <q-card-section class="text-center q-pa-xs">
                <q-icon name="trending_up" size="20px" />
                <div class="text-caption q-mt-xs">Vendas</div>
                <div class="text-subtitle2 text-weight-bold">{{ stats.totalSales.count }}</div>
                <div class="text-caption opacity-70">R$ {{ formatCurrency(stats.totalSales.revenue) }}</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-6 col-sm-3">
            <q-card ref="card2" class="bg-green text-white shadow-sm stat-card">
              <q-card-section class="text-center q-pa-xs">
                <q-icon name="inventory" size="20px" />
                <div class="text-caption q-mt-xs">Produtos</div>
                <div class="text-subtitle2 text-weight-bold">{{ stats.totalProducts }}</div>
                <div class="text-caption opacity-70">Ativos</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-6 col-sm-3">
            <q-card ref="card3" class="bg-orange text-white shadow-sm stat-card">
              <q-card-section class="text-center q-pa-xs">
                <q-icon name="people" size="20px" />
                <div class="text-caption q-mt-xs">Clientes</div>
                <div class="text-subtitle2 text-weight-bold">{{ stats.totalUsers }}</div>
                <div class="text-caption opacity-70">Cadastrados</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-6 col-sm-3">
            <q-card ref="card4" class="bg-purple text-white shadow-sm stat-card">
              <q-card-section class="text-center q-pa-xs">
                <q-icon name="attach_money" size="20px" />
                <div class="text-caption q-mt-xs">Receita</div>
                <div class="text-subtitle2 text-weight-bold">R$ {{ formatCurrency(monthlyRevenue) }}</div>
                <div class="text-caption opacity-70">Este mês</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="col-12 col-lg-7">
        <q-card ref="chartCard1" class="shadow-sm chart-card">
          <q-card-section class="q-pa-sm">
            <div class="text-body1 text-weight-medium text-primary q-mb-sm row items-center">
              <q-icon name="show_chart" size="16px" class="q-mr-xs" />
              Vendas por Mês
            </div>
            <div class="chart-container">
              <canvas ref="salesChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráfico de Pizza -->
      <div class="col-12 col-lg-5">
        <q-card ref="chartCard2" class="shadow-sm chart-card">
          <q-card-section class="q-pa-sm">
            <div class="text-body1 text-weight-medium text-primary q-mb-sm row items-center">
              <q-icon name="pie_chart" size="16px" class="q-mr-xs" />
              Status das Vendas
            </div>
            <div class="chart-container">
              <canvas ref="pieChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Top Produtos -->
      <div class="col-12 col-md-6">
        <q-card ref="topProductsCard" class="shadow-sm list-card">
          <q-card-section class="q-pa-sm">
            <div class="text-body1 text-weight-medium text-primary q-mb-sm row items-center">
              <q-icon name="star" size="16px" class="q-mr-xs" />
              Produtos Mais Vendidos
            </div>
            <q-list dense separator v-if="stats.topProducts.length > 0">
              <q-item v-for="(product, index) in stats.topProducts" :key="product.name" class="q-py-xs">
                <q-item-section avatar>
                  <q-avatar :color="getProductColor(index)" text-color="white" size="xs">
                    {{ index + 1 }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-caption text-weight-medium">{{ product.name }}</q-item-label>
                  <q-item-label caption class="text-grey-6" style="font-size: 10px;">{{ product.salesCount }} vendas</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-caption text-weight-bold text-green-6">R$ {{ formatCurrency(product.revenue) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center q-pa-sm text-grey-6">
              <q-icon name="inventory_2" size="24px" class="q-mb-xs" />
              <div class="text-caption">Nenhum produto vendido ainda</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Vendas Recentes -->
      <div class="col-12 col-md-6">
        <q-card ref="recentSalesCard" class="shadow-sm list-card">
          <q-card-section class="q-pa-sm">
            <div class="text-body1 text-weight-medium text-primary q-mb-sm row items-center">
              <q-icon name="receipt" size="16px" class="q-mr-xs" />
              Vendas Recentes
            </div>
            <q-table
              :rows="stats.recentSales"
              :columns="salesColumns"
              row-key="id"
              :pagination="{ rowsPerPage: 3, sortBy: 'createdAt', descending: true }"
              flat
              dense
              hide-header
              class="compact-table"
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge 
                    :color="getStatusColor(props.value)"
                    :label="getStatusLabel(props.value)"
                    style="font-size: 9px; padding: 2px 6px;"
                  />
                </q-td>
              </template>
              
              <template v-slot:body-cell-totalAmount="props">
                <q-td :props="props">
                  <span class="text-weight-bold text-green-6 text-caption">R$ {{ formatCurrency(props.value) }}</span>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { api } from 'boot/axios';
import Chart from 'chart.js/auto';
import { gsap } from 'gsap';

interface DashboardStats {
  totalSales: {
    count: number;
    revenue: number;
  };
  totalProducts: number;
  totalUsers: number;
  salesByMonth: Array<{
    month: string;
    salesCount: number;
    revenue: number;
  }>;
  topProducts: Array<{
    name: string;
    salesCount: number;
    revenue: number;
  }>;
  recentSales: Array<{
    id: string;
    billingCode: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    customerName: string;
  }>;
}

const stats = ref<DashboardStats>({
  totalSales: { count: 0, revenue: 0 },
  totalProducts: 0,
  totalUsers: 0,
  salesByMonth: [],
  topProducts: [],
  recentSales: []
});

const salesChart = ref<HTMLCanvasElement>();
const pieChart = ref<HTMLCanvasElement>();
const loading = ref(false);

// Animation refs
const headerRef = ref();
const card1 = ref();
const card2 = ref();
const card3 = ref();
const card4 = ref();
const chartCard1 = ref();
const chartCard2 = ref();
const topProductsCard = ref();
const recentSalesCard = ref();

const monthlyRevenue = computed(() => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonth = stats.value.salesByMonth.find(item => {
    const itemDate = new Date(item.month);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  });
  
  return thisMonth?.revenue || 0;
});

const salesColumns = [
  {
    name: 'billingCode',
    label: 'Código',
    field: 'billingCode',
    align: 'left'
  },
  {
    name: 'customerName',
    label: 'Cliente',
    field: 'customerName',
    align: 'left'
  },
  {
    name: 'totalAmount',
    label: 'Valor',
    field: 'totalAmount',
    align: 'right'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center'
  },
  {
    name: 'createdAt',
    label: 'Data',
    field: 'createdAt',
    format: (val: string) => new Date(val).toLocaleDateString('pt-BR')
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'orange',
    confirmed: 'blue',
    completed: 'green',
    cancelled: 'red'
  };
  return colors[status as keyof typeof colors] || 'grey';
};

const getStatusLabel = (status: string) => {
  const labels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  };
  return labels[status as keyof typeof labels] || status;
};

const getProductColor = (index: number) => {
  const colors = ['primary', 'secondary', 'accent', 'positive', 'negative'];
  return colors[index % colors.length];
};

const animateElements = () => {
  const tl = gsap.timeline();
  
  // Header animation
  tl.fromTo(headerRef.value, 
    { opacity: 0, y: -50 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
  );
  
  // Cards animation with stagger
  tl.fromTo([card1.value, card2.value, card3.value, card4.value],
    { opacity: 0, y: 50, scale: 0.9 },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      duration: 0.6, 
      stagger: 0.1,
      ease: "back.out(1.7)"
    },
    "-=0.4"
  );
  
  // Chart cards animation
  tl.fromTo([chartCard1.value, chartCard2.value],
    { opacity: 0, x: -100 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    },
    "-=0.3"
  );
  
  // Bottom cards animation
  tl.fromTo([topProductsCard.value, recentSalesCard.value],
    { opacity: 0, y: 100 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    },
    "-=0.5"
  );
};

const fetchDashboardStats = async () => {
  loading.value = true;
  try {
    const response = await api.get('/admin/dashboard/stats');
    stats.value = response.data;
    
    await nextTick();
    createSalesChart();
    createPieChart();
    
    // Animate after data is loaded
    setTimeout(() => {
      animateElements();
    }, 100);
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  } finally {
    loading.value = false;
  }
};

const createSalesChart = () => {
  if (!salesChart.value) return;
  
  const ctx = salesChart.value.getContext('2d');
  if (!ctx) return;
  
  const chartData = stats.value.salesByMonth.slice().reverse();
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.map(item => 
        new Date(item.month).toLocaleDateString('pt-BR', { 
          month: 'short', 
          year: 'numeric' 
        })
      ),
      datasets: [
        {
          label: 'Vendas',
          data: chartData.map(item => item.salesCount),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Receita (R$)',
          data: chartData.map(item => item.revenue),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    }
  });
};

const createPieChart = () => {
  if (!pieChart.value) return;
  
  const ctx = pieChart.value.getContext('2d');
  if (!ctx) return;
  
  // Calculate status distribution
  const statusCounts = stats.value.recentSales.reduce((acc, sale) => {
    acc[sale.status] = (acc[sale.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const labels = Object.keys(statusCounts).map(status => getStatusLabel(status));
  const data = Object.values(statusCounts);
  const colors = Object.keys(statusCounts).map(status => {
    const colorMap = {
      pending: '#f59e0b',
      confirmed: '#3b82f6', 
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colorMap[status as keyof typeof colorMap] || '#6b7280';
  });
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  });
};

onMounted(() => {
  fetchDashboardStats();
});
</script>

<style scoped>
/* Card styles */
.stat-card {
  height: 90px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart-card {
  border-radius: 8px;
}

.list-card {
  border-radius: 8px;
  max-height: 300px;
}

.chart-container {
  height: 200px;
  position: relative;
}

.opacity-70 {
  opacity: 0.7;
}

.shadow-sm {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Compact table */
.compact-table {
  font-size: 11px;
}

.compact-table .q-table__bottom {
  min-height: 32px;
}

.compact-table .q-td {
  padding: 4px 8px;
}

/* Mobile optimizations */
@media (max-width: 599px) {
  .stat-card {
    height: 80px;
  }
  
  .chart-container {
    height: 180px;
  }
  
  .list-card {
    max-height: 250px;
  }
  
  .text-body1 {
    font-size: 0.875rem !important;
  }
  
  .text-subtitle2 {
    font-size: 0.8rem !important;
  }
  
  .text-caption {
    font-size: 0.7rem !important;
  }
}

@media (max-width: 479px) {
  .stat-card {
    height: 75px;
  }
  
  .q-pa-xs {
    padding: 4px !important;
  }
}

/* Ensure proper grid alignment */
.q-col-gutter-xs > .col {
  padding: 2px;
}

.q-row-gutter-xs > .row {
  margin: -2px;
}
</style>