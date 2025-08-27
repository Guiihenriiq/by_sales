<template>
  <q-layout view="lHh LpR lFf" class="bg-grey-2">

    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round :icon="ICON.MENU" @click="toggleLeftDrawer" />

        <q-toolbar-title class="q-gutter-sm">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          By Sales App
        </q-toolbar-title>

        <q-input
          dense
          standout
          v-model="searchQuery"
          placeholder="Pesquisar..."
          class="q-ml-md"
          style="width: 300px"
          dark
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-space />

        <q-btn dense flat round :icon="ICON.NOTIFICATIONS" class="q-mr-sm">
          <q-badge color="red" floating>4</q-badge>
        </q-btn>

        <q-btn-dropdown flat :label="userName" stretch>
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="account_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Meu Perfil</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      class="bg-grey-10 text-white"
    >
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent q-pa-sm">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">{{ userName }}</div>
          <div class="text-caption">{{ userEmail }}</div>
        </div>
      </q-img>

      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
        <q-list padding>
          <q-item-label header class="text-grey-5">Navegação</q-item-label>

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- PAGE CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { ICON } from 'src/constants/icons';

// Perfil do usuário
const userName = ref('Carlos Silva');
const userEmail = ref('carlos.silva@email.com');
const searchQuery = ref('');

// Lista de links do menu
const linksList: EssentialLinkProps[] = [
  { title: 'Dashboard', caption: 'Visão geral do sistema', icon: 'dashboard', to: '/dashboard'},
  { title: 'Vendas', caption: 'Gerenciar pedidos e faturas', icon: 'point_of_sale', to: '/vendas' },
  { title: 'Clientes', caption: 'Lista de clientes', icon: 'people', to: '/clientes' },
  { title: 'Relatórios', caption: 'Análises e gráficos', icon: 'bar_chart', to: '/relatorios' },
  { title: 'Configurações', caption: 'Ajustes do sistema', icon: 'settings', to: '/configuracoes' }
];

// Controle do drawer
const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="scss">
/* Estilo do link ativo */
.active-link {
  color: white;
  background-color: #2e1065; // cor primária Quasar
  border-left: 4px solid #64b5f6; // detalhe secundário
}
</style>
