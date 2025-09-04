import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'cadastro', component: () => import('pages/CadastroPage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'produtos', component: () => import('pages/ProdutosPage.vue') },
      { path: 'categorias', component: () => import('pages/CategoriaPage.vue') },
      { path: 'clientes', component: () => import('pages/ClientesPage.vue') },
      { path: 'vendas', component: () => import('pages/VendasPage.vue') },
      { path: 'relatorios', component: () => import('pages/RelatoriosPage.vue') },
      { path: 'configuracoes', component: () => import('pages/ConfiguracoesPage.vue') },
      { path: 'demo', component: () => import('pages/AnimationsDemo.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;