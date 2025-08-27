<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Relatórios</div>
    
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Vendas por Período</div>
            <q-select
              v-model="periodo"
              :options="periodos"
              label="Selecionar período"
              outlined
              dense
            />
            <div class="q-mt-md text-center">
              <q-icon name="bar_chart" size="4rem" color="primary" />
              <div class="text-body2 text-grey-6">Gráfico será exibido aqui</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Top Clientes</div>
            <q-list>
              <q-item v-for="cliente in topClientes" :key="cliente.id">
                <q-item-section>
                  <q-item-label>{{ cliente.nome }}</q-item-label>
                  <q-item-label caption>{{ cliente.vendas }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ cliente.valor }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const periodo = ref('30 dias');
const periodos = ['7 dias', '30 dias', '90 dias', '1 ano'];

const topClientes = ref([
  { id: 1, nome: 'João Silva', vendas: '15 vendas', valor: 'R$ 18.750,00' },
  { id: 2, nome: 'Maria Santos', vendas: '12 vendas', valor: 'R$ 10.680,00' },
  { id: 3, nome: 'Pedro Costa', vendas: '8 vendas', valor: 'R$ 16.800,00' },
]);
</script>