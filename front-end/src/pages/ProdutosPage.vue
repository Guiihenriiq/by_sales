<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h3 text-weight-bold text-primary q-mb-md">
            📦 Gestão de Estoque
          </h1>
          <p class="text-subtitle1 text-grey-7">
            Controle e auditoria de inventário
          </p>
        </div>
        <div class="q-gutter-sm">
          <q-btn
            color="secondary"
            icon="inventory"
            label="Auditoria de Estoque"
            size="lg"
            @click="showInventoryAudit = true"
          />
          <q-btn
            color="primary"
            icon="add"
            label="Novo Produto"
            size="lg"
            @click="showCreateDialog = true"
          />
        </div>
      </div>
    </div>

    <!-- Filtros e Alertas de Estoque -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md items-center q-mb-md">
          <div class="col-12 col-md-3">
            <q-input
              v-model="searchTerm"
              placeholder="Buscar produtos..."
              outlined
              dense
              prepend-icon="search"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="selectedCategory"
              :options="categoryOptions"
              label="Categoria"
              outlined
              dense
              clearable
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="stockFilter"
              :options="stockFilterOptions"
              label="Status Estoque"
              outlined
              dense
              clearable
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              clearable
            />
          </div>
        </div>
        
        <!-- Alertas de Estoque -->
        <div class="row q-gutter-md">
          <q-chip 
            color="negative" 
            text-color="white" 
            icon="warning"
            :label="`${lowStockCount} produtos com estoque baixo`"
            v-if="lowStockCount > 0"
          />
          <q-chip 
            color="orange" 
            text-color="white" 
            icon="inventory_2"
            :label="`${outOfStockCount} produtos sem estoque`"
            v-if="outOfStockCount > 0"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de Produtos -->
    <q-card>
      <q-card-section>
        <q-table
          :rows="filteredProducts"
          :columns="productColumns"
          row-key="id"
          :loading="productStore.loading"
          flat
          bordered
        >
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <q-avatar size="60px" square>
                <img
                  :src="props.row.images[0] || '/placeholder-product.jpg'"
                  :alt="props.row.name"
                />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-price="props">
            <q-td :props="props">
              <div>
                <div class="text-weight-bold text-positive">
                  R$ {{ typeof props.row.price === 'string' ? parseFloat(props.row.price).toFixed(2) : props.row.price?.toFixed(2) }}
                </div>
                <div class="text-caption text-grey-6">
                  Custo: R$ {{ typeof props.row.costPrice === 'string' ? parseFloat(props.row.costPrice).toFixed(2) : props.row.costPrice?.toFixed(2) }}
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-stock="props">
            <q-td :props="props">
              <div class="text-center">
                <q-badge
                  :color="getStockColor(props.row)"
                  :label="props.row.stockQuantity"
                  class="q-mb-xs"
                />
                <div class="text-caption text-grey-6">
                  Min: {{ props.row.minStock || 0 }} | Max: {{ props.row.maxStock || 1000 }}
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-location="props">
            <q-td :props="props">
              <div>
                <div>{{ props.row.location || 'Não definido' }}</div>
                <div class="text-caption text-grey-6">
                  {{ props.row.supplier || 'Sem fornecedor' }}
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-lastInventory="props">
            <q-td :props="props">
              {{ props.row.lastInventoryDate ? 
                new Date(props.row.lastInventoryDate).toLocaleDateString('pt-BR') : 
                'Nunca' 
              }}
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="props.value ? 'positive' : 'negative'"
                :label="props.value ? 'Ativo' : 'Inativo'"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="inventory"
                color="primary"
                flat
                round
                dense
                @click="updateStock(props.row)"
              >
                <q-tooltip>Atualizar Estoque</q-tooltip>
              </q-btn>
              <q-btn
                icon="edit"
                color="secondary"
                flat
                round
                dense
                @click="editProduct(props.row)"
              >
                <q-tooltip>Editar Produto</q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                color="negative"
                flat
                round
                dense
                @click="deleteProduct(props.row.id)"
              >
                <q-tooltip>Excluir Produto</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog de Criar/Editar Produto -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 800px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">
            {{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveProduct" class="q-gutter-md">
            <div class="row q-gutter-md">
              <div class="col-12 col-md-7">
                <q-input
                  v-model="productForm.name"
                  label="Nome do Produto"
                  outlined
                  :rules="[val => !!val || 'Nome é obrigatório']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="productForm.barcode"
                  label="Código de Barras"
                  outlined
                />
              </div>
            </div>

            <q-input
              v-model="productForm.description"
              label="Descrição"
              type="textarea"
              outlined
              rows="3"
            />

            <div class="row q-gutter-md">
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="productForm.price"
                  label="Preço de Venda"
                  type="number"
                  step="0.01"
                  outlined
                  prefix="R$"
                  :rules="[val => val > 0 || 'Preço deve ser maior que zero']"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="productForm.costPrice"
                  label="Preço de Custo"
                  type="number"
                  step="0.01"
                  outlined
                  prefix="R$"
                />
              </div>
              <div class="col-12 col-md-5">
                <q-select
                  v-model="productForm.categoryId"
                  :options="categoryOptions"
                  label="Categoria"
                  outlined
                  emit-value
                  map-options
                />
              </div>
            </div>

            <div class="row q-gutter-md">
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="productForm.stockQuantity"
                  label="Estoque Atual"
                  type="number"
                  outlined
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="productForm.minStock"
                  label="Estoque Mínimo"
                  type="number"
                  outlined
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="productForm.maxStock"
                  label="Estoque Máximo"
                  type="number"
                  outlined
                />
              </div>
            </div>

            <div class="row q-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="productForm.supplier"
                  label="Fornecedor"
                  outlined
                />
              </div>
              <div class="col-12 col-md-5">
                <q-input
                  v-model="productForm.location"
                  label="Localização no Estoque"
                  outlined
                />
              </div>
            </div>

            <q-input
              v-model="productForm.inventoryNotes"
              label="Observações de Inventário"
              type="textarea"
              outlined
              rows="2"
            />

            <q-toggle
              v-model="productForm.isActive"
              label="Produto Ativo"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            color="grey"
            flat
            @click="closeDialog"
          />
          <q-btn
            label="Salvar"
            color="primary"
            @click="saveProduct"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Atualização de Estoque -->
    <q-dialog v-model="showStockDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Atualizar Estoque</div>
          <div class="text-subtitle2 text-grey-7">{{ selectedProduct?.name }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveStockUpdate" class="q-gutter-md">
            <div class="row q-gutter-md items-center">
              <div class="col-5">
                <q-input
                  v-model.number="stockForm.currentStock"
                  label="Estoque Atual"
                  type="number"
                  outlined
                  readonly
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="stockForm.newStock"
                  label="Novo Estoque"
                  type="number"
                  outlined
                  :rules="[val => val >= 0 || 'Estoque não pode ser negativo']"
                />
              </div>
            </div>

            <q-input
              v-model="stockForm.inventoryNotes"
              label="Observações da Atualização"
              type="textarea"
              outlined
              rows="3"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            color="grey"
            flat
            @click="closeStockDialog"
          />
          <q-btn
            label="Atualizar"
            color="primary"
            @click="saveStockUpdate"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Auditoria de Estoque -->
    <q-dialog v-model="showInventoryAudit" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Auditoria de Estoque</div>
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-md">
            <div class="row q-gutter-md">
              <q-card class="col">
                <q-card-section class="text-center">
                  <div class="text-h4 text-primary">{{ totalProducts }}</div>
                  <div class="text-subtitle2">Total de Produtos</div>
                </q-card-section>
              </q-card>
              <q-card class="col">
                <q-card-section class="text-center">
                  <div class="text-h4 text-negative">{{ outOfStockCount }}</div>
                  <div class="text-subtitle2">Sem Estoque</div>
                </q-card-section>
              </q-card>
              <q-card class="col">
                <q-card-section class="text-center">
                  <div class="text-h4 text-warning">{{ lowStockCount }}</div>
                  <div class="text-subtitle2">Estoque Baixo</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Fechar"
            color="primary"
            @click="showInventoryAudit = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useProductStore } from 'src/stores/products';
import { useCategoryStore } from 'src/stores/categories';

const $q = useQuasar();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const searchTerm = ref('');
const selectedCategory = ref(null);
const stockFilter = ref(null);
const statusFilter = ref(null);
const showCreateDialog = ref(false);
const showStockDialog = ref(false);
const showInventoryAudit = ref(false);
const editingProduct = ref(null);
const selectedProduct = ref(null);
const saving = ref(false);

const productForm = ref({
  name: '',
  description: '',
  price: 0,
  costPrice: 0,
  categoryId: '',
  stockQuantity: 0,
  minStock: 0,
  maxStock: 1000,
  supplier: '',
  barcode: '',
  location: '',
  inventoryNotes: '',
  isActive: true
});

const stockForm = ref({
  currentStock: 0,
  newStock: 0,
  inventoryNotes: ''
});

const productColumns = [
  { name: 'image', label: 'Imagem', field: 'images', align: 'center' },
  { name: 'name', label: 'Produto', field: 'name', align: 'left', sortable: true },
  { name: 'barcode', label: 'Código', field: 'barcode', align: 'left' },
  { name: 'price', label: 'Preços', field: 'price', align: 'right', sortable: true },
  { name: 'stock', label: 'Estoque', field: 'stockQuantity', align: 'center', sortable: true },
  { name: 'location', label: 'Local/Fornecedor', field: 'location', align: 'left' },
  { name: 'lastInventory', label: 'Última Auditoria', field: 'lastInventoryDate', align: 'center' },
  { name: 'status', label: 'Status', field: 'isActive', align: 'center' },
  { name: 'actions', label: 'Ações', field: '', align: 'center' }
];

const stockFilterOptions = [
  { label: 'Sem Estoque', value: 'out_of_stock' },
  { label: 'Estoque Baixo', value: 'low_stock' },
  { label: 'Estoque Normal', value: 'normal_stock' },
  { label: 'Estoque Alto', value: 'high_stock' }
];

const statusOptions = [
  { label: 'Ativo', value: true },
  { label: 'Inativo', value: false }
];

const categoryOptions = computed(() => 
  categoryStore.categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
);

const filteredProducts = computed(() => {
  let products = productStore.products;

  if (searchTerm.value) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    products = products.filter(p => p.categoryId === selectedCategory.value);
  }

  if (stockFilter.value) {
    products = products.filter(p => {
      const minStock = p.minStock || 0;
      const maxStock = p.maxStock || 1000;
      switch (stockFilter.value) {
        case 'out_of_stock': return p.stockQuantity === 0;
        case 'low_stock': return p.stockQuantity > 0 && p.stockQuantity <= minStock;
        case 'normal_stock': return p.stockQuantity > minStock && p.stockQuantity < maxStock;
        case 'high_stock': return p.stockQuantity >= maxStock;
        default: return true;
      }
    });
  }

  if (statusFilter.value !== null) {
    products = products.filter(p => p.isActive === statusFilter.value);
  }

  return products;
});

const totalProducts = computed(() => productStore.products.length);
const outOfStockCount = computed(() => 
  productStore.products.filter(p => p.stockQuantity === 0).length
);
const lowStockCount = computed(() => 
  productStore.products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= (p.minStock || 0)).length
);

const getStockColor = (product: any) => {
  if (product.stockQuantity === 0) return 'negative';
  if (product.stockQuantity <= (product.minStock || 0)) return 'warning';
  if (product.stockQuantity >= (product.maxStock || 1000)) return 'info';
  return 'positive';
};

const saveProduct = async () => {
  saving.value = true;
  
  const result = editingProduct.value
    ? await productStore.updateProduct(editingProduct.value.id, productForm.value)
    : await productStore.createProduct(productForm.value);

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: `Produto ${editingProduct.value ? 'atualizado' : 'criado'} com sucesso!`
    });
    closeDialog();
  } else {
    $q.notify({
      type: 'negative',
      message: result.message
    });
  }
  
  saving.value = false;
};

const editProduct = (product: any) => {
  editingProduct.value = product;
  productForm.value = { ...product };
  showCreateDialog.value = true;
};

const updateStock = (product: any) => {
  selectedProduct.value = product;
  stockForm.value = {
    currentStock: product.stockQuantity,
    newStock: product.stockQuantity,
    inventoryNotes: ''
  };
  showStockDialog.value = true;
};

const saveStockUpdate = async () => {
  if (!selectedProduct.value) return;
  
  saving.value = true;
  
  const result = await productStore.updateStock(selectedProduct.value.id, {
    stockQuantity: stockForm.value.newStock,
    inventoryNotes: stockForm.value.inventoryNotes
  });

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Estoque atualizado com sucesso!'
    });
    closeStockDialog();
  } else {
    $q.notify({
      type: 'negative',
      message: result.message
    });
  }
  
  saving.value = false;
};

const deleteProduct = async (id: string) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir este produto?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const result = await productStore.deleteProduct(id);
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Produto excluído com sucesso!'
      });
    }
  });
};

const closeDialog = () => {
  showCreateDialog.value = false;
  editingProduct.value = null;
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    costPrice: 0,
    categoryId: '',
    stockQuantity: 0,
    minStock: 0,
    maxStock: 1000,
    supplier: '',
    barcode: '',
    location: '',
    inventoryNotes: '',
    isActive: true
  };
};

const closeStockDialog = () => {
  showStockDialog.value = false;
  selectedProduct.value = null;
  stockForm.value = {
    currentStock: 0,
    newStock: 0,
    inventoryNotes: ''
  };
};

onMounted(() => {
  productStore.fetchProducts();
  categoryStore.fetchCategories();
});
</script>

<style scoped>
.page-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}
</style>