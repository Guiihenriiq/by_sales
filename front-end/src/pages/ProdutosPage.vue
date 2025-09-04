<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h3 text-weight-bold text-primary q-mb-md">
            📦 Produtos
          </h1>
          <p class="text-subtitle1 text-grey-7">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Novo Produto"
          size="lg"
          @click="showCreateDialog = true"
        />
      </div>
    </div>

    <!-- Filtros -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md items-center">
          <div class="col-12 col-md-4">
            <q-input
              v-model="searchTerm"
              placeholder="Buscar produtos..."
              outlined
              dense
              prepend-icon="search"
            />
          </div>
          <div class="col-12 col-md-3">
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
              v-model="statusFilter"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              clearable
            />
          </div>
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
              <span class="text-weight-bold text-positive">
                R$ {{ props.value.toFixed(2) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-stock="props">
            <q-td :props="props">
              <q-badge
                :color="props.value > 10 ? 'positive' : props.value > 0 ? 'warning' : 'negative'"
                :label="props.value"
              />
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
                icon="edit"
                color="primary"
                flat
                round
                dense
                @click="editProduct(props.row)"
              />
              <q-btn
                icon="delete"
                color="negative"
                flat
                round
                dense
                @click="deleteProduct(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog de Criar/Editar Produto -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">
            {{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveProduct" class="q-gutter-md">
            <q-input
              v-model="productForm.name"
              label="Nome do Produto"
              outlined
              :rules="[val => !!val || 'Nome é obrigatório']"
            />

            <q-input
              v-model="productForm.description"
              label="Descrição"
              type="textarea"
              outlined
              rows="3"
            />

            <div class="row q-gutter-md">
              <div class="col">
                <q-input
                  v-model.number="productForm.price"
                  label="Preço"
                  type="number"
                  step="0.01"
                  outlined
                  prefix="R$"
                  :rules="[val => val > 0 || 'Preço deve ser maior que zero']"
                />
              </div>
              <div class="col">
                <q-input
                  v-model.number="productForm.stockQuantity"
                  label="Estoque"
                  type="number"
                  outlined
                />
              </div>
            </div>

            <q-select
              v-model="productForm.categoryId"
              :options="categoryOptions"
              label="Categoria"
              outlined
              emit-value
              map-options
            />

            <q-file
              v-model="productImages"
              label="Imagens do Produto"
              outlined
              multiple
              accept="image/*"
              max-files="5"
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
const statusFilter = ref(null);
const showCreateDialog = ref(false);
const editingProduct = ref(null);
const saving = ref(false);
const productImages = ref(null);

const productForm = ref({
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  stockQuantity: 0,
  isActive: true
});

const productColumns = [
  { name: 'image', label: 'Imagem', field: 'images', align: 'center' },
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'category', label: 'Categoria', field: row => row.category?.name || 'Sem categoria', align: 'left' },
  { name: 'price', label: 'Preço', field: 'price', align: 'right', sortable: true },
  { name: 'stock', label: 'Estoque', field: 'stockQuantity', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'isActive', align: 'center' },
  { name: 'actions', label: 'Ações', field: '', align: 'center' }
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
      p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    products = products.filter(p => p.categoryId === selectedCategory.value);
  }

  if (statusFilter.value !== null) {
    products = products.filter(p => p.isActive === statusFilter.value);
  }

  return products;
});

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
    categoryId: '',
    stockQuantity: 0,
    isActive: true
  };
  productImages.value = null;
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