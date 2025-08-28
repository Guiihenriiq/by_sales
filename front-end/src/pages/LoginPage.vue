<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4">
        <q-card class="shadow-2">
          <q-card-section class="bg-white text-center">
            <div class="text-h4 text-primary q-mb-md">Login</div>
            <q-form class="q-gutter-md">
              <q-input
                v-model="email"
                label="Email"
                type="email"
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
                label="Entrar" 
                class="full-width" 
                unelevated 
                @click="login"
              />
              <q-btn 
                color="secondary" 
                label="Criar Conta" 
                class="full-width" 
                outline 
                @click="$router.push('/cadastro')"
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
const email = ref('');
const senha = ref('');

function login() {
  router.push('/dashboard');
}
</script>