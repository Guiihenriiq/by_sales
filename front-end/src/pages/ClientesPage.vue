<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4 text-primary">Clientes</div>
      <q-btn color="primary" icon="add" label="Novo Cliente" unelevated />
    </div>

    <q-card class="shadow-2">
      <q-card-section class="bg-white">
        <q-input
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
