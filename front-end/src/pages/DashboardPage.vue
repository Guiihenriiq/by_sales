<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Painel de Controle</h1>
        <div class="header-actions">
          <q-btn
            rounded
            icon="refresh"
            label="Atualizar"
            class="action-btn action-btn-primary"
            @click="fetchDashboardData"
          />
          <q-btn
            rounded
            icon="settings"
            label="Configurações"
            class="action-btn action-btn-secondary"
          />
        </div>
      </div>

      <!-- Dashboard Cards -->
      <div class="cards-grid">
        <q-card
          v-for="card in dashboardCards"
          :key="card.title"
          class="card-item"
        >
          <q-card-section class="card-content">
            <div class="card-header">
              <q-icon :name="card.icon" :class="`card-icon text-${card.color}-500`" />
              <q-badge
                :color="card.badgeColor"
                class="card-badge"
                v-if="card.trend"
              >
                {{ card.trend }}
              </q-badge>
            </div>
            <div class="card-body">
              <div class="card-title">{{ card.title }}</div>
              <div :class="`card-value text-${card.color}-600`">{{ card.value }}</div>
            </div>
            <q-linear-progress
              :value="card.progress"
              :color="card.color"
              class="card-progress"
              rounded
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Chart and Activity Section -->
      <div class="charts-grid">
        <q-card class="chart-card">
          <h2 class="chart-title">Vendas Semanais</h2>
          <canvas ref="salesChart" class="chart-canvas"></canvas>
        </q-card>
        <q-card class="activity-card">
          <h2 class="chart-title">Atividade Recente</h2>
          <q-timeline>
            <q-timeline-entry
              v-for="(activity, index) in recentActivities"
              :key="index"
              :title="activity.title"
              :subtitle="activity.time"
              :icon="activity.icon"
              :color="activity.color"
              class="timeline-entry"
            >
              {{ activity.description }}
            </q-timeline-entry>
          </q-timeline>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import Chart from 'chart.js/auto';

// Quasar instance
const $q = useQuasar();

// Dashboard card data
const dashboardCards = ref([
  {
    title: 'Vendas Hoje',
    value: 'R$ 12.450',
    icon: 'point_of_sale',
    color: 'primary',
    badgeColor: 'positive',
    trend: '+8%',
    progress: 0.75,
  },
  {
    title: 'Clientes',
    value: '1.234',
    icon: 'people',
    color: 'secondary',
    badgeColor: 'info',
    trend: '+12%',
    progress: 0.62,
  },
  {
    title: 'Pedidos',
    value: '89',
    icon: 'shopping_cart',
    color: 'warning',
    badgeColor: 'warning',
    trend: '-3%',
    progress: 0.45,
  },
  {
    title: 'Crescimento',
    value: '+15%',
    icon: 'trending_up',
    color: 'positive',
    badgeColor: 'positive',
    trend: '+5%',
    progress: 0.88,
  },
]);

// Recent activities
const recentActivities = ref([
  {
    title: 'Nova Venda',
    time: 'Hoje, 14:30',
    description: 'Venda de R$ 2.500 registrada para cliente João Silva.',
    icon: 'point_of_sale',
    color: 'primary',
  },
  {
    title: 'Novo Cliente',
    time: 'Hoje, 12:15',
    description: 'Maria Oliveira cadastrada no sistema.',
    icon: 'person_add',
    color: 'secondary',
  },
  {
    title: 'Atualização de Pedido',
    time: 'Ontem, 09:45',
    description: 'Pedido #1234 atualizado para enviado.',
    icon: 'shopping_cart',
    color: 'warning',
  },
]);

// Chart reference
const salesChart = ref<HTMLCanvasElement | null>(null);

// Fetch dashboard data (mock API call)
const fetchDashboardData = async () => {
  $q.notify({
    message: 'Dados do painel atualizados!',
    color: 'positive',
    position: 'top',
  });
};

// Initialize chart
onMounted(() => {
  if (salesChart.value) {
    try {
      new Chart(salesChart.value, {
        type: 'line',
        data: {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Vendas (R$)',
              data: [5000, 7000, 4500, 9000, 12000, 8000, 6000],
              borderColor: '#4F46E5',
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Failed to initialize chart:', error);
      $q.notify({
        message: 'Erro ao carregar o gráfico de vendas.',
        color: 'negative',
        position: 'top',
      });
    }
  }
});
</script>

<style scoped>
/* --- Variáveis Globais (Tema) --- */
.dashboard-page {
  --primary-color: #4f46e5;      /* indigo-600 */
  --primary-color-hover: #4338ca; /* indigo-700 */
  --secondary-color: #4b5563;   /* gray-600 */
  --text-color-primary: #1f2937;  /* gray-800 */
  --text-color-secondary: #6b7281;/* gray-500 */
  --bg-color: #f8fafc;           /* slate-50 */
  --card-bg-color: #ffffff;
  --card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --card-shadow-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --border-radius: 1rem; /* 16px */
  --transition-speed: 0.3s;
}

/* --- Estilos de Base --- */
.dashboard-page {
  background-color: var(--bg-color);
  padding: clamp(1rem, 4vw, 2rem); /* Padding responsivo */
}

.dashboard-container {
  max-width: 1280px; /* Equivalente a max-w-7xl */
  margin-inline: auto;
}

/* --- Cabeçalho --- */
.dashboard-header {
  display: flex;
  flex-wrap: wrap; /* Permite que os botões quebrem a linha em telas pequenas */
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: clamp(1.5rem, 5vw, 2.5rem);
}

.dashboard-title {
  font-size: clamp(1.875rem, 4vw, 2.25rem); /* Tamanho de fonte responsivo */
  font-weight: 800; /* extabold */
  color: var(--primary-color);
  letter-spacing: -0.025em; /* tracking-tight */
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* --- Estilos dos Botões --- */
.action-btn {
  transition: all var(--transition-speed) ease;
}
.action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

/* --- Grid de Cards --- */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card-item {
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  overflow: hidden; /* Garante que elementos internos respeitem o border-radius */
}
.card-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-shadow-hover);
}

.card-content {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-icon {
  font-size: 2.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  margin-top: 1rem;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.25rem;
}

.card-progress {
  margin-top: 1rem;
  height: 0.5rem;
}

/* --- Grid de Gráficos e Atividades --- */
.charts-grid {
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chart-card, .activity-card {
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 1rem;
}

.chart-canvas {
  width: 100%;
  height: 250px;
}
</style>
