import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'vendas', component: () => import('pages/VendasPage.vue') },
      { path: 'clientes', component: () => import('pages/ClientesPage.vue') },
      { path: 'relatorios', component: () => import('pages/RelatoriosPage.vue') },
      { path: 'configuracoes', component: () => import('pages/ConfiguracoesPage.vue') },
      // Rotas do e-commerce
      { path: 'produtos', component: () => import('pages/ProdutosPage.vue') },
      { path: 'sobre', component: () => import('pages/SobrePage.vue') },
      { path: 'cadastro', component: () => import('pages/CadastroPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'perfil', component: () => import('pages/PerfilPage.vue') },
      { path: 'categoria/:slug', component: () => import('pages/CategoriaPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
