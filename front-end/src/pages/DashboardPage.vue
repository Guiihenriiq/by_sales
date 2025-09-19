<template>
  <q-page class="q-pa-lg">
    <div class="dashboard-header q-mb-xl">
      <h1 class="text-h3 text-weight-bold text-primary q-mb-md">
        📊 Dashboard
      </h1>
      <p class="text-subtitle1 text-grey-7">
        Visão geral do seu e-commerce
      </p>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="row q-gutter-lg q-mb-xl">
      <div class="col-12 col-md-3">
        <q-card class="stats-card bg-gradient-primary">
          <q-card-section class="text-white">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-h4 text-weight-bold">{{ stats.totalProducts.toLocaleString() }}</div>
                <div class="text-subtitle2">Total de Produtos</div>
              </div>
              <q-icon name="inventory" size="48px" class="opacity-70" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stats-card bg-gradient-success">
          <q-card-section class="text-white">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-h4 text-weight-bold">{{ stats.todayOrders }}</div>
                <div class="text-subtitle2">Pedidos Hoje</div>
              </div>
              <q-icon name="shopping_cart" size="48px" class="opacity-70" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stats-card bg-gradient-warning">
          <q-card-section class="text-white">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-h4 text-weight-bold">{{ stats.totalUsers }}</div>
                <div class="text-subtitle2">Total de Clientes</div>
              </div>
              <q-icon name="people" size="48px" class="opacity-70" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stats-card bg-gradient-info">
          <q-card-section class="text-white">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-h4 text-weight-bold">R$ {{ stats.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</div>
                <div class="text-subtitle2">Receita Hoje</div>
              </div>
              <q-icon name="attach_money" size="48px" class="opacity-70" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="row q-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              📈 Vendas dos Últimos 7 Dias
            </div>
            <div class="chart-container">
              <canvas ref="salesChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              🏷️ Produtos por Categoria
            </div>
            <div class="chart-container">
              <canvas ref="categoryChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Pedidos Recentes -->
    <div class="q-mt-xl">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">
            🛍️ Pedidos Recentes
          </div>
          <q-table
            :rows="recentOrders"
            :columns="orderColumns"
            row-key="id"
            flat
            bordered
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="getStatusColor(props.value)"
                  :label="props.value"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { api } from 'boot/axios';

Chart.register(...registerables);

const salesChart = ref<HTMLCanvasElement>();
const categoryChart = ref<HTMLCanvasElement>();
const loading = ref(true);

// Estados reativos para dados reais
const stats = ref({
  totalProducts: 0,
  todayOrders: 0,
  totalUsers: 0,
  todayRevenue: 0
});

const recentOrders = ref([]);
const salesData = ref([]);

const orderColumns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'customer', label: 'Cliente', field: 'customer', align: 'left' },
  { name: 'total', label: 'Total', field: 'total', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'date', label: 'Data', field: 'date', align: 'left' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Entregue': return 'positive';
    case 'Processando': return 'warning';
    case 'Pendente': return 'negative';
    default: return 'grey';
  }
};

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    const data = response.data;
    
    stats.value = {
      totalProducts: data.totalProducts,
      todayOrders: data.todayOrders,
      totalUsers: data.totalUsers,
      todayRevenue: data.todayRevenue
    };
    
    recentOrders.value = data.recentOrders.map((order: any) => ({
      id: order.id.slice(-8),
      customer: `Cliente ${order.userId.slice(-4)}`,
      total: `R$ ${(typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount).toFixed(2)}`,
      status: getStatusText(order.status),
      date: new Date(order.createdAt).toLocaleDateString('pt-BR')
    }));
    
    salesData.value = data.last7Days;
    
    // Criar gráficos após carregar dados
    createCharts();
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'confirmed': return 'Confirmado';
    case 'shipped': return 'Enviado';
    case 'delivered': return 'Entregue';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
};

const createCharts = () => {
  // Gráfico de Vendas com dados reais
  if (salesChart.value && salesData.value.length > 0) {
    const labels = salesData.value.map((item: any) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    });
    const data = salesData.value.map((item: any) => item.revenue);
    
    new Chart(salesChart.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Vendas (R$)',
          data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Gráfico de Categorias (dados estáticos por enquanto)
  if (categoryChart.value) {
    new Chart(categoryChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Eletrônicos', 'Roupas', 'Casa', 'Esportes'],
        datasets: [{
          data: [30, 25, 20, 25],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.stats-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.chart-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.chart-container {
  height: 300px;
  position: relative;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}
</style>