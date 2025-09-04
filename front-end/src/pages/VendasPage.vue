<template>
  <q-page class="q-pa-md bg-grey-1">
    <div ref="pageHeader" class="row items-center justify-between q-mb-md">
      <div class="text-h4 text-primary">Vendas</div>
      <q-btn color="primary" icon="add" label="Nova Venda" unelevated />
    </div>
    
    <q-card ref="salesCard" class="shadow-2">
      <q-card-section class="bg-white">
        <q-table
          :rows="vendas"
          :columns="columns"
          row-key="id"
          :loading="loading"
          color="primary"
          class="bg-white"
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
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

const loading = ref(false);
const pageHeader = ref();
const salesCard = ref();

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

onMounted(() => {
  const tl = gsap.timeline();
  
  tl.fromTo(pageHeader.value, 
    { opacity: 0, x: -100 }, 
    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
  )
  .fromTo(salesCard.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4'
  );
});
</script>