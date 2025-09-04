<template>
  <q-page class="q-pa-md bg-grey-1">
    <div ref="pageHeader" class="row items-center justify-between q-mb-md">
      <div class="text-h4 text-primary">Clientes</div>
      <q-btn color="primary" icon="add" label="Novo Cliente" unelevated />
    </div>

    <q-card ref="clientsCard" class="shadow-2">
      <q-card-section class="bg-white">
        <q-input
          ref="searchInput"
          v-model="filter"
          placeholder="Buscar cliente..."
          outlined
          dense
          color="primary"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>

        <q-table
          :rows="clientes"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :loading="loading"
          color="primary"
          class="bg-white"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

const loading = ref(false);
const filter = ref('');
const pageHeader = ref();
const clientsCard = ref();
const searchInput = ref();

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'cidade', label: 'Cidade', field: 'cidade', align: 'left' },
];

const clientes = ref([
  { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-9999', cidade: 'São Paulo' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 88888-8888', cidade: 'Rio de Janeiro' },
  { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', telefone: '(11) 77777-7777', cidade: 'Belo Horizonte' },
]);

onMounted(() => {
  const tl = gsap.timeline();
  
  tl.fromTo(pageHeader.value, 
    { opacity: 0, x: -100 }, 
    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
  )
  .fromTo(clientsCard.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4'
  )
  .fromTo(searchInput.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2'
  );
});
</script>
