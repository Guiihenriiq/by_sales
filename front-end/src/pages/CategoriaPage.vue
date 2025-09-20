<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h3 text-weight-bold text-primary q-mb-md">
            🏷️ Gestão de Categorias
          </h1>
          <p class="text-subtitle1 text-grey-7">
            Organize e gerencie categorias de produtos
          </p>
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Nova Categoria"
          size="lg"
          @click="showCreateDialog = true"
        />
      </div>
    </div>

    <!-- Filtros -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md items-center">
          <div class="col-12 col-md-6">
            <q-input
              v-model="searchTerm"
              placeholder="Buscar categorias..."
              outlined
              dense
              prepend-icon="search"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Grid de Categorias -->
    <div class="row q-gutter-lg">
      <div 
        class="col-12 col-md-6 col-lg-4" 
        v-for="category in filteredCategories" 
        :key="category.id"
      >
        <q-card class="category-card shadow-2 hover-gradient-1">
          <q-img 
            :src="category.imageUrl || 'https://via.placeholder.com/300x200/5b21b6/ffffff?text=Categoria'"
            class="category-image"
            ratio="16/9"
          />
          
          <q-card-section>
            <div class="text-h6 text-primary q-mb-sm">{{ category.name }}</div>
            <div class="text-body2 text-grey-7 q-mb-md">
              {{ category.description || 'Sem descrição' }}
            </div>
            
            <div class="flex items-center justify-between">
              <q-chip 
                color="primary" 
                text-color="white" 
                icon="inventory"
                :label="`${getProductCount(category.id)} produtos`"
              />
              
              <div class="q-gutter-xs">
                <q-btn
                  icon="edit"
                  color="primary"
                  flat
                  round
                  dense
                  @click="editCategory(category)"
                >
                  <q-tooltip>Editar Categoria</q-tooltip>
                </q-btn>
                <q-btn
                  icon="delete"
                  color="negative"
                  flat
                  round
                  dense
                  @click="deleteCategory(category.id)"
                >
                  <q-tooltip>Excluir Categoria</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-if="filteredCategories.length === 0" class="text-center q-pa-xl">
      <q-icon name="category" size="80px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">
        {{ searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada' }}
      </div>
      <div class="text-body2 text-grey-5 q-mt-sm">
        {{ searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira categoria' }}
      </div>
      <q-btn
        v-if="!searchTerm"
        color="primary"
        label="Criar Primeira Categoria"
        class="q-mt-md"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- Dialog de Criar/Editar Categoria -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">
            {{ editingCategory ? 'Editar Categoria' : 'Nova Categoria' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveCategory" class="q-gutter-md">
            <q-input
              v-model="categoryForm.name"
              label="Nome da Categoria"
              outlined
              :rules="[val => !!val || 'Nome é obrigatório']"
            />

            <q-input
              v-model="categoryForm.description"
              label="Descrição"
              type="textarea"
              outlined
              rows="3"
            />

            <q-input
              v-model="categoryForm.imageUrl"
              label="URL da Imagem"
              outlined
              hint="URL da imagem para representar a categoria"
            />

            <!-- Preview da imagem -->
            <div v-if="categoryForm.imageUrl" class="q-mt-md">
              <div class="text-caption text-grey-6 q-mb-xs">Preview:</div>
              <q-img 
                :src="categoryForm.imageUrl"
                style="height: 120px; max-width: 200px"
                class="rounded-borders"
                @error="imageError = true"
              />
              <div v-if="imageError" class="text-negative text-caption q-mt-xs">
                Erro ao carregar imagem
              </div>
            </div>
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
            @click="saveCategory"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">
            Tem certeza que deseja excluir a categoria "{{ categoryToDelete?.name }}"?
          </span>
        </q-card-section>

        <q-card-section v-if="getProductCount(categoryToDelete?.id) > 0">
          <q-banner class="bg-warning text-dark">
            <template v-slot:avatar>
              <q-icon name="warning" />
            </template>
            Esta categoria possui {{ getProductCount(categoryToDelete?.id) }} produto(s) associado(s).
            Eles ficarão sem categoria após a exclusão.
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="showDeleteDialog = false" />
          <q-btn 
            flat 
            label="Excluir" 
            color="negative" 
            @click="confirmDelete"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useCategoryStore } from 'src/stores/categories';
import { useProductStore } from 'src/stores/products';

const $q = useQuasar();
const categoryStore = useCategoryStore();
const productStore = useProductStore();

const searchTerm = ref('');
const showCreateDialog = ref(false);
const showDeleteDialog = ref(false);
const editingCategory = ref(null);
const categoryToDelete = ref(null);
const saving = ref(false);
const deleting = ref(false);
const imageError = ref(false);

const categoryForm = ref({
  name: '',
  description: '',
  imageUrl: ''
});

const filteredCategories = computed(() => {
  let categories = categoryStore.categories;

  if (searchTerm.value) {
    categories = categories.filter(c => 
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  return categories;
});

const getProductCount = (categoryId: string) => {
  if (!categoryId) return 0;
  return productStore.products.filter(p => p.categoryId === categoryId).length;
};

const saveCategory = async () => {
  saving.value = true;
  imageError.value = false;
  
  const result = editingCategory.value
    ? await categoryStore.updateCategory(editingCategory.value.id, categoryForm.value)
    : await categoryStore.createCategory(categoryForm.value);

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: `Categoria ${editingCategory.value ? 'atualizada' : 'criada'} com sucesso!`
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

const editCategory = (category: any) => {
  editingCategory.value = category;
  categoryForm.value = { ...category };
  imageError.value = false;
  showCreateDialog.value = true;
};

const deleteCategory = (category: any) => {
  categoryToDelete.value = category;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!categoryToDelete.value) return;
  
  deleting.value = true;
  
  const result = await categoryStore.deleteCategory(categoryToDelete.value.id);
  
  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Categoria excluída com sucesso!'
    });
    showDeleteDialog.value = false;
    categoryToDelete.value = null;
  } else {
    $q.notify({
      type: 'negative',
      message: result.message
    });
  }
  
  deleting.value = false;
};

const closeDialog = () => {
  showCreateDialog.value = false;
  editingCategory.value = null;
  categoryForm.value = {
    name: '',
    description: '',
    imageUrl: ''
  };
  imageError.value = false;
};

onMounted(() => {
  categoryStore.fetchCategories();
  productStore.fetchProducts();
});
</script>

<style scoped>
.page-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}

.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.category-image {
  height: 200px;
}

.hover-gradient-1:hover {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>