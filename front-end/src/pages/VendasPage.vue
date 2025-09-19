<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h4 text-primary">Vendas</div>
        <div class="text-subtitle2 text-grey-6">Gerencie as vendas do e-commerce</div>
      </div>
      <q-btn 
        color="primary" 
        icon="refresh" 
        label="Atualizar" 
        @click="fetchSales"
        :loading="loading"
        unelevated 
      />
    </div>

    <q-card class="shadow-2">
      <q-card-section class="bg-white">
        <q-input
          v-model="filter"
          placeholder="Buscar por código, cliente..."
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
          :rows="vendas"
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
                :color="getStatusColor(props.value)"
                :label="getStatusLabel(props.value)"
              />
            </q-td>
          </template>
          
          <template v-slot:body-cell-acoes="props">
            <q-td :props="props">
              <div class="q-gutter-sm">
                <q-btn
                  size="sm"
                  color="primary"
                  icon="visibility"
                  @click="viewSale(props.row)"
                  dense
                >
                  <q-tooltip>Ver Detalhes</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.status === 'pending'"
                  size="sm"
                  color="positive"
                  icon="check"
                  @click="approveSale(props.row)"
                  dense
                >
                  <q-tooltip>Aprovar</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.status === 'pending'"
                  size="sm"
                  color="negative"
                  icon="close"
                  @click="rejectSale(props.row)"
                  dense
                >
                  <q-tooltip>Recusar</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog de Detalhes da Venda -->
    <q-dialog v-model="showDetails" persistent>
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalhes da Venda</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedSale">
          <div class="row q-gutter-md">
            <div class="col">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Código de Cobrança</q-item-label>
                    <q-item-label>{{ selectedSale.billingCode }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Cliente</q-item-label>
                    <q-item-label>{{ selectedSale.cliente }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Valor Total</q-item-label>
                    <q-item-label>{{ formatCurrency(selectedSale.valor) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Forma de Pagamento</q-item-label>
                    <q-item-label>{{ getPaymentMethodLabel(selectedSale.paymentMethod) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Parcelas</q-item-label>
                    <q-item-label>{{ selectedSale.parcelas }}x</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Endereço de Entrega</q-item-label>
                    <q-item-label>{{ selectedSale.endereco }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Data do Pedido</q-item-label>
                    <q-item-label>{{ selectedSale.data }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="selectedSale.notes">
                  <q-item-section>
                    <q-item-label caption>Observações</q-item-label>
                    <q-item-label>{{ selectedSale.notes }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Parcelas -->
          <div class="q-mt-md" v-if="selectedSale.installments">
            <div class="text-subtitle1 q-mb-sm">Parcelas</div>
            <q-table
              :rows="selectedSale.installments"
              :columns="installmentColumns"
              row-key="id"
              dense
              flat
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge 
                    :color="getInstallmentStatusColor(props.value)"
                    :label="getInstallmentStatusLabel(props.value)"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-card-section>

        <q-card-actions align="right" v-if="selectedSale && selectedSale.status === 'pending'">
          <q-btn flat label="Recusar" color="negative" @click="rejectSale(selectedSale)" />
          <q-btn unelevated label="Aprovar" color="positive" @click="approveSale(selectedSale)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

const $q = useQuasar();
const loading = ref(true);
const filter = ref('');
const vendas = ref([]);
const showDetails = ref(false);
const selectedSale = ref(null);

const columns = [
  { name: 'billingCode', label: 'Código', field: 'billingCode', align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right', format: (val: number) => formatCurrency(val) },
  { name: 'parcelas', label: 'Parcelas', field: 'parcelas', align: 'center' },
  { name: 'paymentMethod', label: 'Pagamento', field: 'paymentMethod', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
];

const installmentColumns = [
  { name: 'number', label: 'Parcela', field: 'installmentNumber', align: 'center' },
  { name: 'amount', label: 'Valor', field: 'amount', align: 'right', format: (val: number) => formatCurrency(val) },
  { name: 'dueDate', label: 'Vencimento', field: 'dueDate', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
];

const fetchSales = async () => {
  try {
    const response = await api.get('/admin/sales');
    vendas.value = response.data.map((sale: any) => ({
      id: sale.id,
      billingCode: sale.billingCode,
      cliente: sale.user?.name || 'N/A',
      valor: parseFloat(sale.totalAmount),
      parcelas: sale.installmentsCount,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      endereco: sale.shippingAddress,
      notes: sale.notes,
      data: new Date(sale.createdAt).toLocaleDateString('pt-BR'),
      installments: sale.installments?.map((inst: any) => ({
        ...inst,
        dueDate: new Date(inst.dueDate).toLocaleDateString('pt-BR')
      }))
    }));
  } catch (error) {
    console.error('Erro ao carregar vendas:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar vendas'
    });
  } finally {
    loading.value = false;
  }
};

const viewSale = (sale: any) => {
  selectedSale.value = sale;
  showDetails.value = true;
};

const approveSale = async (sale: any) => {
  try {
    await api.put(`/admin/sales/${sale.id}/status`, { status: 'confirmed' });
    await fetchSales();
    showDetails.value = false;
    $q.notify({
      type: 'positive',
      message: 'Venda aprovada com sucesso!'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao aprovar venda'
    });
  }
};

const rejectSale = async (sale: any) => {
  $q.dialog({
    title: 'Confirmar Rejeição',
    message: `Tem certeza que deseja recusar a venda ${sale.billingCode}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.put(`/admin/sales/${sale.id}/status`, { status: 'cancelled' });
      await fetchSales();
      showDetails.value = false;
      $q.notify({
        type: 'positive',
        message: 'Venda recusada'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao recusar venda'
      });
    }
  });
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'warning',
    confirmed: 'positive',
    cancelled: 'negative',
    completed: 'info'
  };
  return colors[status] || 'grey';
};

const getStatusLabel = (status: string) => {
  const labels = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Concluída'
  };
  return labels[status] || status;
};

const getPaymentMethodLabel = (method: string) => {
  const labels = {
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX',
    boleto: 'Boleto',
    cash: 'Dinheiro'
  };
  return labels[method] || method;
};

const getInstallmentStatusColor = (status: string) => {
  const colors = {
    pending: 'warning',
    paid: 'positive',
    overdue: 'negative',
    cancelled: 'grey'
  };
  return colors[status] || 'grey';
};

const getInstallmentStatusLabel = (status: string) => {
  const labels = {
    pending: 'Pendente',
    paid: 'Pago',
    overdue: 'Vencido',
    cancelled: 'Cancelado'
  };
  return labels[status] || status;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

onMounted(() => {
  fetchSales();
});
</script>