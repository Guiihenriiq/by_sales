<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Vendas</div>
      <q-btn color="primary" icon="add" label="Nova Venda" />
    </div>
    
    <q-card>
      <q-card-section>
        <q-table
          :rows="vendas"
          :columns="columns"
          row-key="id"
          :loading="loading"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.value)" :label="props.value" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
];

const vendas = ref([
  { id: 1, cliente: 'João Silva', valor: 'R$ 1.250,00', data: '2024-01-15', status: 'Concluída' },
  { id: 2, cliente: 'Maria Santos', valor: 'R$ 890,00', data: '2024-01-14', status: 'Pendente' },
  { id: 3, cliente: 'Pedro Costa', valor: 'R$ 2.100,00', data: '2024-01-13', status: 'Concluída' },
]);

function getStatusColor(status: string) {
  return status === 'Concluída' ? 'positive' : 'warning';
}
</script>