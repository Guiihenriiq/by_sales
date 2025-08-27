<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Clientes</div>
      <q-btn color="primary" icon="add" label="Novo Cliente" />
    </div>
    
    <q-card>
      <q-card-section>
        <q-input
          v-model="filter"
          placeholder="Buscar cliente..."
          outlined
          dense
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        
        <q-table
          :rows="clientes"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :loading="loading"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
const filter = ref('');

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
</script>