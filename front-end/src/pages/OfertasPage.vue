<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h3 text-weight-bold text-primary q-mb-md">
            🎯 Gestão de Ofertas
          </h1>
          <p class="text-subtitle1 text-grey-7">
            Crie e gerencie ofertas e cupons de desconto
          </p>
        </div>
        <div class="q-gutter-sm">
          <q-btn
            color="secondary"
            icon="local_offer"
            label="Novo Cupom"
            size="lg"
            @click="showCouponDialog = true"
          />
          <q-btn
            color="primary"
            icon="add"
            label="Nova Oferta"
            size="lg"
            @click="showOfferDialog = true"
          />
        </div>
      </div>
    </div>

    <!-- Tabs para Ofertas e Cupons -->
    <q-tabs v-model="activeTab" class="text-primary q-mb-lg">
      <q-tab name="offers" label="Ofertas" icon="local_offer" />
      <q-tab name="coupons" label="Cupons" icon="confirmation_number" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <!-- Tab de Ofertas -->
      <q-tab-panel name="offers">
        <q-card>
          <q-card-section>
            <q-table
              :rows="offers"
              :columns="offerColumns"
              row-key="id"
              :loading="loadingOffers"
              flat
              bordered
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    :color="getOfferStatusColor(props.row)"
                    :label="getOfferStatusLabel(props.row)"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-discount="props">
                <q-td :props="props">
                  <span class="text-weight-bold">
                    {{ props.row.discountType === 'percentage' ? 
                      `${props.row.discountValue}%` : 
                      `R$ ${props.row.discountValue.toFixed(2)}` 
                    }}
                  </span>
                </q-td>
              </template>

              <template v-slot:body-cell-period="props">
                <q-td :props="props">
                  <div>
                    <div>{{ formatDate(props.row.startDate) }}</div>
                    <div class="text-caption text-grey-6">
                      até {{ formatDate(props.row.endDate) }}
                    </div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-usage="props">
                <q-td :props="props">
                  <div class="text-center">
                    <div>{{ props.row.usedCount }}</div>
                    <div class="text-caption text-grey-6">
                      {{ props.row.usageLimit ? `de ${props.row.usageLimit}` : 'ilimitado' }}
                    </div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    icon="edit"
                    color="primary"
                    flat
                    round
                    dense
                    @click="editOffer(props.row)"
                  />
                  <q-btn
                    icon="delete"
                    color="negative"
                    flat
                    round
                    dense
                    @click="deleteOffer(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Tab de Cupons -->
      <q-tab-panel name="coupons">
        <q-card>
          <q-card-section>
            <q-table
              :rows="coupons"
              :columns="couponColumns"
              row-key="id"
              :loading="loadingCoupons"
              flat
              bordered
            >
              <template v-slot:body-cell-code="props">
                <q-td :props="props">
                  <q-chip 
                    color="primary" 
                    text-color="white" 
                    :label="props.row.code"
                    icon="confirmation_number"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    :color="getCouponStatusColor(props.row)"
                    :label="getCouponStatusLabel(props.row)"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-discount="props">
                <q-td :props="props">
                  <span class="text-weight-bold">
                    {{ props.row.discountType === 'percentage' ? 
                      `${props.row.discountValue}%` : 
                      `R$ ${props.row.discountValue.toFixed(2)}` 
                    }}
                  </span>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    icon="edit"
                    color="primary"
                    flat
                    round
                    dense
                    @click="editCoupon(props.row)"
                  />
                  <q-btn
                    icon="delete"
                    color="negative"
                    flat
                    round
                    dense
                    @click="deleteCoupon(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Dialog de Criar/Editar Oferta -->
    <q-dialog v-model="showOfferDialog" persistent>
      <q-card style="min-width: 800px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">
            {{ editingOffer ? 'Editar Oferta' : 'Nova Oferta' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveOffer" class="q-gutter-md">
            <q-input
              v-model="offerForm.title"
              label="Título da Oferta"
              outlined
              :rules="[val => !!val || 'Título é obrigatório']"
            />

            <q-input
              v-model="offerForm.description"
              label="Descrição"
              type="textarea"
              outlined
              rows="3"
            />

            <div class="row q-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="offerForm.discountType"
                  :options="discountTypeOptions"
                  label="Tipo de Desconto"
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="offerForm.discountValue"
                  label="Valor do Desconto"
                  type="number"
                  step="0.01"
                  outlined
                  :suffix="offerForm.discountType === 'percentage' ? '%' : 'R$'"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="offerForm.minPurchaseAmount"
                  label="Compra Mínima"
                  type="number"
                  step="0.01"
                  outlined
                  prefix="R$"
                />
              </div>
            </div>

            <div class="row q-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="offerForm.startDate"
                  label="Data de Início"
                  type="datetime-local"
                  outlined
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="offerForm.endDate"
                  label="Data de Fim"
                  type="datetime-local"
                  outlined
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="offerForm.usageLimit"
                  label="Limite de Uso"
                  type="number"
                  outlined
                  hint="Deixe vazio para ilimitado"
                />
              </div>
            </div>

            <q-input
              v-model="offerForm.bannerImage"
              label="URL da Imagem do Banner"
              outlined
            />

            <!-- Seleção de Produtos -->
            <div class="q-mt-md">
              <div class="text-subtitle2 q-mb-sm">Produtos da Oferta:</div>
              <q-select
                v-model="selectedProducts"
                :options="productOptions"
                label="Selecionar Produtos"
                outlined
                multiple
                use-chips
                emit-value
                map-options
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            color="grey"
            flat
            @click="closeOfferDialog"
          />
          <q-btn
            label="Salvar"
            color="primary"
            @click="saveOffer"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Criar/Editar Cupom -->
    <q-dialog v-model="showCouponDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">
            {{ editingCoupon ? 'Editar Cupom' : 'Novo Cupom' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveCoupon" class="q-gutter-md">
            <div class="row q-gutter-md">
              <div class="col-12 col-md-7">
                <q-input
                  v-model="couponForm.code"
                  label="Código do Cupom"
                  outlined
                  :rules="[val => !!val || 'Código é obrigatório']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-btn
                  label="Gerar Código"
                  color="secondary"
                  outline
                  @click="generateCouponCode"
                />
              </div>
            </div>

            <q-input
              v-model="couponForm.title"
              label="Título do Cupom"
              outlined
              :rules="[val => !!val || 'Título é obrigatório']"
            />

            <q-input
              v-model="couponForm.description"
              label="Descrição"
              type="textarea"
              outlined
              rows="2"
            />

            <div class="row q-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="couponForm.discountType"
                  :options="discountTypeOptions"
                  label="Tipo de Desconto"
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="couponForm.discountValue"
                  label="Valor do Desconto"
                  type="number"
                  step="0.01"
                  outlined
                  :suffix="couponForm.discountType === 'percentage' ? '%' : 'R$'"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="couponForm.usageLimit"
                  label="Limite de Uso"
                  type="number"
                  outlined
                />
              </div>
            </div>

            <div class="row q-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="couponForm.startDate"
                  label="Data de Início"
                  type="datetime-local"
                  outlined
                />
              </div>
              <div class="col-12 col-md-5">
                <q-input
                  v-model="couponForm.endDate"
                  label="Data de Fim"
                  type="datetime-local"
                  outlined
                />
              </div>
            </div>

            <q-input
              v-model.number="couponForm.minPurchaseAmount"
              label="Compra Mínima"
              type="number"
              step="0.01"
              outlined
              prefix="R$"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            color="grey"
            flat
            @click="closeCouponDialog"
          />
          <q-btn
            label="Salvar"
            color="primary"
            @click="saveCoupon"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useProductStore } from 'src/stores/products';

const $q = useQuasar();
const productStore = useProductStore();

const activeTab = ref('offers');
const offers = ref([]);
const coupons = ref([]);
const loadingOffers = ref(false);
const loadingCoupons = ref(false);
const showOfferDialog = ref(false);
const showCouponDialog = ref(false);
const editingOffer = ref(null);
const editingCoupon = ref(null);
const saving = ref(false);
const selectedProducts = ref([]);

const offerForm = ref({
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  minPurchaseAmount: 0,
  maxDiscountAmount: null,
  startDate: '',
  endDate: '',
  usageLimit: null,
  bannerImage: ''
});

const couponForm = ref({
  code: '',
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  minPurchaseAmount: 0,
  maxDiscountAmount: null,
  startDate: '',
  endDate: '',
  usageLimit: 1
});

const offerColumns = [
  { name: 'title', label: 'Título', field: 'title', align: 'left', sortable: true },
  { name: 'discount', label: 'Desconto', field: 'discountValue', align: 'center' },
  { name: 'period', label: 'Período', field: 'startDate', align: 'center' },
  { name: 'usage', label: 'Uso', field: 'usedCount', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: '', align: 'center' }
];

const couponColumns = [
  { name: 'code', label: 'Código', field: 'code', align: 'left' },
  { name: 'title', label: 'Título', field: 'title', align: 'left', sortable: true },
  { name: 'discount', label: 'Desconto', field: 'discountValue', align: 'center' },
  { name: 'usage', label: 'Uso', field: 'usedCount', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: '', align: 'center' }
];

const discountTypeOptions = [
  { label: 'Porcentagem (%)', value: 'percentage' },
  { label: 'Valor Fixo (R$)', value: 'fixed_amount' }
];

const productOptions = computed(() => 
  productStore.products.map(product => ({
    label: product.name,
    value: product.id
  }))
);

const fetchOffers = async () => {
  loadingOffers.value = true;
  try {
    const response = await api.get('/admin/offers');
    offers.value = response.data;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar ofertas'
    });
  } finally {
    loadingOffers.value = false;
  }
};

const fetchCoupons = async () => {
  loadingCoupons.value = true;
  try {
    const response = await api.get('/admin/coupons');
    coupons.value = response.data;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar cupons'
    });
  } finally {
    loadingCoupons.value = false;
  }
};

const saveOffer = async () => {
  saving.value = true;
  try {
    const data = {
      ...offerForm.value,
      productIds: selectedProducts.value
    };
    
    if (editingOffer.value) {
      await api.put(`/admin/offers/${editingOffer.value.id}`, data);
    } else {
      await api.post('/admin/offers', data);
    }
    
    $q.notify({
      type: 'positive',
      message: `Oferta ${editingOffer.value ? 'atualizada' : 'criada'} com sucesso!`
    });
    
    closeOfferDialog();
    fetchOffers();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar oferta'
    });
  } finally {
    saving.value = false;
  }
};

const saveCoupon = async () => {
  saving.value = true;
  try {
    if (editingCoupon.value) {
      await api.put(`/admin/coupons/${editingCoupon.value.id}`, couponForm.value);
    } else {
      await api.post('/admin/coupons', couponForm.value);
    }
    
    $q.notify({
      type: 'positive',
      message: `Cupom ${editingCoupon.value ? 'atualizado' : 'criado'} com sucesso!`
    });
    
    closeCouponDialog();
    fetchCoupons();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar cupom'
    });
  } finally {
    saving.value = false;
  }
};

const generateCouponCode = async () => {
  try {
    const response = await api.get('/admin/coupons/generate-code');
    couponForm.value.code = response.data.code;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao gerar código'
    });
  }
};

const editOffer = (offer: any) => {
  editingOffer.value = offer;
  offerForm.value = { ...offer };
  selectedProducts.value = offer.offerProducts?.map((op: any) => op.productId) || [];
  showOfferDialog.value = true;
};

const editCoupon = (coupon: any) => {
  editingCoupon.value = coupon;
  couponForm.value = { ...coupon };
  showCouponDialog.value = true;
};

const deleteOffer = async (id: string) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir esta oferta?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/admin/offers/${id}`);
      $q.notify({
        type: 'positive',
        message: 'Oferta excluída com sucesso!'
      });
      fetchOffers();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir oferta'
      });
    }
  });
};

const deleteCoupon = async (id: string) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir este cupom?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/admin/coupons/${id}`);
      $q.notify({
        type: 'positive',
        message: 'Cupom excluído com sucesso!'
      });
      fetchCoupons();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir cupom'
      });
    }
  });
};

const closeOfferDialog = () => {
  showOfferDialog.value = false;
  editingOffer.value = null;
  selectedProducts.value = [];
  offerForm.value = {
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    startDate: '',
    endDate: '',
    usageLimit: null,
    bannerImage: ''
  };
};

const closeCouponDialog = () => {
  showCouponDialog.value = false;
  editingCoupon.value = null;
  couponForm.value = {
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    startDate: '',
    endDate: '',
    usageLimit: 1
  };
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const getOfferStatusColor = (offer: any) => {
  const now = new Date();
  const startDate = new Date(offer.startDate);
  const endDate = new Date(offer.endDate);
  
  if (offer.status === 'inactive') return 'grey';
  if (endDate < now) return 'negative';
  if (startDate > now) return 'warning';
  return 'positive';
};

const getOfferStatusLabel = (offer: any) => {
  const now = new Date();
  const startDate = new Date(offer.startDate);
  const endDate = new Date(offer.endDate);
  
  if (offer.status === 'inactive') return 'Inativa';
  if (endDate < now) return 'Expirada';
  if (startDate > now) return 'Agendada';
  return 'Ativa';
};

const getCouponStatusColor = (coupon: any) => {
  if (coupon.status === 'used') return 'grey';
  if (coupon.status === 'expired') return 'negative';
  if (coupon.status === 'inactive') return 'warning';
  return 'positive';
};

const getCouponStatusLabel = (coupon: any) => {
  switch (coupon.status) {
    case 'used': return 'Usado';
    case 'expired': return 'Expirado';
    case 'inactive': return 'Inativo';
    default: return 'Ativo';
  }
};

onMounted(() => {
  fetchOffers();
  fetchCoupons();
  productStore.fetchProducts();
});
</script>

<style scoped>
.page-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}
</style>