<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="text-h4 text-primary q-mb-md">Configurações</div>
    
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="shadow-2 hover-gradient-1">
          <q-card-section class="bg-white">
            <div class="text-h6 text-primary q-mb-md">Perfil do Usuário</div>
            <q-form class="q-gutter-md">
              <q-input
                v-model="perfil.nome"
                label="Nome"
                outlined
                dense
                color="primary"
              />
              <q-input
                v-model="perfil.email"
                label="Email"
                outlined
                dense
                color="primary"
              />
              <q-input
                v-model="perfil.telefone"
                label="Telefone"
                outlined
                dense
                color="primary"
              />
              <q-btn color="primary" label="Salvar" unelevated />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-6">
        <q-card class="shadow-2 hover-gradient-1">
          <q-card-section class="bg-white">
            <div class="text-h6 text-primary q-mb-md">Preferências</div>
            <q-list>
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label class="text-primary">Notificações por email</q-item-label>
                  <q-item-label caption>Receber alertas por email</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="preferencias.emailNotif" color="primary" />
                </q-item-section>
              </q-item>
              
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label class="text-primary">Modo escuro</q-item-label>
                  <q-item-label caption>Ativar tema escuro</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="preferencias.darkMode" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const perfil = ref({
  nome: 'Carlos Silva',
  email: 'carlos.silva@email.com',
  telefone: '(11) 99999-9999'
});

const preferencias = ref({
  emailNotif: true,
  darkMode: false
});
</script>