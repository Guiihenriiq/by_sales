<template>
  <q-page class="animations-demo q-pa-md">
    <div class="demo-header">
      <h1 class="text-h3 text-primary q-mb-md">Demonstração de Animações GSAP</h1>
      <p class="text-h6 text-grey-7">Explore as animações implementadas</p>
    </div>

    <!-- Loading Demo -->
    <q-card class="demo-section q-mb-lg">
      <q-card-section>
        <h3>Loading Personalizado</h3>
        <q-btn color="primary" @click="showLoader">Mostrar Loading</q-btn>
        <LoadingSpinner :show="loading" text="Carregando dados..." />
      </q-card-section>
    </q-card>

    <!-- Chart Demo -->
    <q-card class="demo-section q-mb-lg">
      <q-card-section>
        <h3>Gráfico Animado</h3>
        <AnimatedChart 
          title="Vendas por Mês"
          :data="chartData"
        />
        <q-btn color="secondary" @click="updateChart" class="q-mt-md">Atualizar Dados</q-btn>
      </q-card-section>
    </q-card>

    <!-- Form Demo -->
    <q-card class="demo-section q-mb-lg">
      <q-card-section>
        <h3>Formulário Animado</h3>
        <AnimatedForm 
          :fields="formFields"
          submit-label="Enviar Dados"
          :loading="formLoading"
          @submit="handleFormSubmit"
        />
      </q-card-section>
    </q-card>

    <!-- State Transition Demo -->
    <q-card class="demo-section q-mb-lg">
      <q-card-section>
        <h3>Transições de Estado</h3>
        <div class="q-mb-md">
          <q-btn 
            v-for="state in Object.keys(demoStates)" 
            :key="state"
            :color="currentDemoState === state ? 'primary' : 'grey'"
            :label="state"
            @click="currentDemoState = state"
            class="q-mr-sm q-mb-sm"
          />
        </div>
        <StateTransition 
          :states="demoStates"
          :current-state="currentDemoState"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoadingSpinner from 'src/components/LoadingSpinner.vue';
import AnimatedChart from 'src/components/AnimatedChart.vue';
import AnimatedForm from 'src/components/AnimatedForm.vue';
import StateTransition from 'src/components/StateTransition.vue';

const loading = ref(false);
const formLoading = ref(false);
const currentDemoState = ref('success');

const chartData = ref([
  { label: 'Jan', value: 1200 },
  { label: 'Fev', value: 1900 },
  { label: 'Mar', value: 800 },
  { label: 'Abr', value: 2100 },
  { label: 'Mai', value: 1600 }
]);

const formFields = ref([
  { name: 'name', label: 'Nome', type: 'text', icon: 'person' },
  { name: 'email', label: 'Email', type: 'email', icon: 'email' },
  { name: 'message', label: 'Mensagem', type: 'textarea', icon: 'message' }
]);

const demoStates = {
  success: {
    template: '<div class="text-positive text-center"><div class="text-h6">✅ Sucesso!</div></div>'
  },
  error: {
    template: '<div class="text-negative text-center"><div class="text-h6">❌ Erro!</div></div>'
  },
  loading: {
    template: '<div class="text-primary text-center"><div class="text-h6">⏳ Carregando...</div></div>'
  }
};

const showLoader = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};

const updateChart = () => {
  chartData.value = chartData.value.map(item => ({
    ...item,
    value: Math.floor(Math.random() * 2500) + 500
  }));
};

const handleFormSubmit = (data: any) => {
  formLoading.value = true;
  setTimeout(() => {
    formLoading.value = false;
    console.log('Form submitted:', data);
  }, 2000);
};

// Funções removidas para simplificar
</script>

<style scoped>
.animations-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-section {
  margin-bottom: 2rem;
}

.scroll-section {
  min-height: 600px;
}

.scroll-items {
  margin-top: 2rem;
}

.scroll-item {
  padding: 1rem;
  margin: 1rem 0;
  background: linear-gradient(135deg, #5b21b6, #818cf8);
  color: white;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}
</style>