<template>
  <q-page class="q-pa-md bg-grey-1">
    <div ref="pageHeader" class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h4 text-primary">Clientes</div>
        <div class="text-subtitle2 text-grey-6">Gerencie os clientes cadastrados</div>
      </div>
      <q-btn 
        color="primary" 
        icon="refresh" 
        label="Atualizar" 
        @click="fetchCustomers"
        :loading="loading"
        unelevated 
      />
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
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge 
                :color="props.row.banned ? 'negative' : (props.row.emailVerified ? 'positive' : 'warning')"
                :label="props.value"
              />
            </q-td>
          </template>
          
          <template v-slot:body-cell-acoes="props">
            <q-td :props="props">
              <div class="q-gutter-sm">
                <q-btn
                  v-if="!props.row.banned"
                  size="sm"
                  color="negative"
                  icon="block"
                  @click="confirmBan(props.row)"
                  dense
                >
                  <q-tooltip>Banir Cliente</q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  size="sm"
                  color="positive"
                  icon="check_circle"
                  @click="confirmUnban(props.row)"
                  dense
                >
                  <q-tooltip>Desbanir Cliente</q-tooltip>
                </q-btn>
              </div>
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
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const loading = ref(true);
const filter = ref('');
const pageHeader = ref();
const clientsCard = ref();
const searchInput = ref();

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'cadastro', label: 'Cadastro', field: 'cadastro', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
];

const clientes = ref([]);

const fetchCustomers = async () => {
  try {
    console.log('Buscando clientes...');
    const response = await api.get('/admin/customers');
    console.log('Resposta recebida:', response.data);
    
    clientes.value = response.data.map((customer: any) => ({
      id: customer.id,
      nome: customer.name,
      email: customer.email,
      telefone: customer.phone || 'Não informado',
      status: customer.banned ? 'Banido' : (customer.emailVerified ? 'Ativo' : 'Pendente'),
      cadastro: new Date(customer.createdAt).toLocaleDateString('pt-BR'),
      emailVerified: customer.emailVerified,
      banned: customer.banned
    }));
    
    console.log('Clientes processados:', clientes.value);
    
    $q.notify({
      type: 'positive',
      message: `${clientes.value.length} clientes carregados`
    });
  } catch (error: any) {
    console.error('Erro ao carregar clientes:', error);
    
    // Se erro de autenticação, redirecionar para login
    if (error.response?.status === 401 || error.response?.status === 403) {
      $q.notify({
        type: 'negative',
        message: 'Sessão expirada. Faça login novamente.'
      });
      return;
    }
    
    $q.notify({
      type: 'negative',
      message: `Erro ao carregar clientes: ${error.response?.data?.error || error.message}`
    });
  } finally {
    loading.value = false;
  }
};

const banCustomer = async (customer: any) => {
  try {
    await api.put(`/admin/customers/${customer.id}/ban`);
    await fetchCustomers();
    $q.notify({
      type: 'positive',
      message: 'Cliente banido com sucesso'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao banir cliente'
    });
  }
};

const unbanCustomer = async (customer: any) => {
  try {
    await api.put(`/admin/customers/${customer.id}/unban`);
    await fetchCustomers();
    $q.notify({
      type: 'positive',
      message: 'Cliente desbaneado com sucesso'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao desbanir cliente'
    });
  }
};

const confirmBan = (customer: any) => {
  $q.dialog({
    title: 'Confirmar Banimento',
    message: `Tem certeza que deseja banir o cliente ${customer.nome}? Isso impedirá o login dele.`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    banCustomer(customer);
  });
};

const confirmUnban = (customer: any) => {
  $q.dialog({
    title: 'Confirmar Desbloqueio',
    message: `Tem certeza que deseja desbloquear o cliente ${customer.nome}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    unbanCustomer(customer);
  });
};

const animateElements = () => {
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
};

onMounted(async () => {
  await fetchCustomers();
  setTimeout(() => {
    animateElements();
  }, 100);
});
</script>
