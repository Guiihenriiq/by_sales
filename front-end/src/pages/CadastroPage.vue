<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card class="shadow-2">
          <q-card-section class="bg-white text-center">
            <div class="text-h4 text-primary q-mb-md">Criar Conta</div>
            <q-form class="q-gutter-md">
              <div class="row q-gutter-md">
                <q-input
                  v-model="nome"
                  label="Nome Completo"
                  outlined
                  color="primary"
                  class="col"
                />
                <q-input
                  v-model="email"
                  label="Email"
                  type="email"
                  outlined
                  color="primary"
                  class="col"
                />
              </div>
              <q-input
                v-model="telefone"
                label="Telefone"
                outlined
                color="primary"
              />
              <q-input
                v-model="senha"
                label="Senha"
                type="password"
                outlined
                color="primary"
              />
              <q-btn 
                color="primary" 
                label="Criar Conta" 
                class="full-width" 
                unelevated 
                @click="cadastrar"
              />
              <q-btn 
                color="secondary" 
                label="Já tenho conta" 
                class="full-width" 
                outline 
                @click="$router.push('/login')"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const nome = ref('');
const email = ref('');
const telefone = ref('');
const senha = ref('');

function cadastrar() {
  router.push('/dashboard');
}
</script>