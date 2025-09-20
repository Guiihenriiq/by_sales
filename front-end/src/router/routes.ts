import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue'), meta: { requiresGuest: true } },
      { path: 'cadastro', component: () => import('pages/CadastroPage.vue'), meta: { requiresGuest: true } },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true } },
      { path: 'produtos', component: () => import('pages/ProdutosPage.vue'), meta: { requiresAuth: true } },
      { path: 'categorias', component: () => import('pages/CategoriaPage.vue'), meta: { requiresAuth: true } },
      { path: 'ofertas', component: () => import('pages/OfertasPage.vue'), meta: { requiresAuth: true } },
      { path: 'clientes', component: () => import('pages/ClientesPage.vue'), meta: { requiresAuth: true } },
      { path: 'vendas', component: () => import('pages/VendasPage.vue'), meta: { requiresAuth: true } },
      { path: 'relatorios', component: () => import('pages/RelatoriosPage.vue'), meta: { requiresAuth: true } },
      { path: 'lives', component: () => import('pages/LivesPage.vue'), meta: { requiresAuth: true } },
      { path: 'configuracoes', component: () => import('pages/ConfiguracoesPage.vue'), meta: { requiresAuth: true } },
      { path: 'demo', component: () => import('pages/AnimationsDemo.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;