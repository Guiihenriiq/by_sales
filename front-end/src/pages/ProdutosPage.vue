<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="text-h4 text-primary q-mb-md">Produtos</div>
    
    <q-card class="shadow-2">
      <q-card-section class="bg-white">
        <div class="row q-gutter-md">
          <div class="col-12 col-md-4" v-for="produto in produtos" :key="produto.id">
            <q-card class="product-card shadow-1 hover-gradient-1">
              <q-img :src="produto.imagem" class="product-image" />
              <q-card-section>
                <div class="text-h6 text-primary">{{ produto.nome }}</div>
                <div class="text-h5 text-positive q-mt-sm">{{ produto.preco }}</div>
                <q-btn color="primary" label="Comprar" class="q-mt-md" unelevated />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const produtos = ref([
  { id: 1, nome: 'Smartphone', preco: 'R$ 899,00', imagem: 'https://via.placeholder.com/300x200/5b21b6/ffffff?text=Smartphone' },
  { id: 2, nome: 'Notebook', preco: 'R$ 2.499,00', imagem: 'https://via.placeholder.com/300x200/818cf8/ffffff?text=Notebook' },
  { id: 3, nome: 'Headphone', preco: 'R$ 299,00', imagem: 'https://via.placeholder.com/300x200/5b21b6/ffffff?text=Headphone' },
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