<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="text-h4 text-primary q-mb-md">{{ categoriaAtual }}</div>
    
    <q-card class="shadow-2">
      <q-card-section class="bg-white">
        <div class="text-body1 q-mb-md">Produtos da categoria {{ categoriaAtual }}</div>
        <div class="row q-gutter-md">
          <div class="col-12 col-md-4" v-for="produto in produtosCategoria" :key="produto.id">
            <q-card class="product-card shadow-1 hover-gradient-1">
              <q-img :src="produto.imagem" class="product-image" />
              <q-card-section>
                <div class="text-h6 text-primary">{{ produto.nome }}</div>
                <div class="text-h5 text-positive q-mt-sm">{{ produto.preco }}</div>
                <q-btn color="primary" label="Ver Detalhes" class="q-mt-md" unelevated />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-btn color="secondary" label="Voltar ao Home" @click="$router.push('/')" class="q-mt-md" outline />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const categoriaAtual = computed(() => {
  const slug = route.params.slug as string;
  return slug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Categoria';
});

const produtosCategoria = ref([
  { id: 1, nome: 'Produto 1', preco: 'R$ 199,00', imagem: 'https://via.placeholder.com/300x200/5b21b6/ffffff?text=Produto+1' },
  { id: 2, nome: 'Produto 2', preco: 'R$ 299,00', imagem: 'https://via.placeholder.com/300x200/818cf8/ffffff?text=Produto+2' },
  { id: 3, nome: 'Produto 3', preco: 'R$ 399,00', imagem: 'https://via.placeholder.com/300x200/5b21b6/ffffff?text=Produto+3' },
]);
</script>

<style scoped>
.product-card {
  transition: transform 0.3s ease;
}
.product-card:hover {
  transform: translateY(-5px);
}
.product-image {
  height: 200px;
}
</style>