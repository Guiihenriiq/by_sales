<template>
  <q-layout view="lHh LpR lFf" class="bg-grey-2">

    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white ecommerce-header">
      <q-toolbar>
        <q-btn dense flat round :icon="ICON.MENU" @click="toggleLeftDrawer" />

        <q-toolbar-title class="q-gutter-sm">
          <q-avatar size="40px">
            <img src="~/assets/hot-sale.gif" class="hot-sale-logo" />
          </q-avatar>
          <span class="brand-text">By Sales</span>
          <q-chip color="negative" text-color="white" icon="local_fire_department" size="sm" class="sale-chip">
            HOT SALE!
          </q-chip>
        </q-toolbar-title>

        <q-input
          dense
          standout
          v-model="searchQuery"
          placeholder="Buscar produtos, ofertas..."
          class="q-ml-md search-input"
          style="width: 350px"
          dark
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-btn flat dense icon="tune" />
          </template>
        </q-input>

        <q-space />

        <!-- Carrinho -->
        <q-btn dense flat round icon="shopping_cart" class="q-mr-sm cart-btn">
          <q-badge color="negative" floating rounded>3</q-badge>
          <q-tooltip>Carrinho de Compras</q-tooltip>
        </q-btn>

        <!-- Favoritos -->
        <q-btn dense flat round icon="favorite" class="q-mr-sm wishlist-btn">
          <q-badge color="pink" floating rounded>7</q-badge>
          <q-tooltip>Lista de Desejos</q-tooltip>
        </q-btn>

        <!-- Notificações -->
        <q-btn dense flat round icon="notifications" class="q-mr-sm notification-btn">
          <q-badge color="orange" floating rounded class="pulse-animation">5</q-badge>
          <q-tooltip>Ofertas e Promoções</q-tooltip>
        </q-btn>

        <q-btn-dropdown flat :label="userName" stretch class="user-dropdown">
          <q-list>
            <q-item clickable v-close-popup @click="$router.push('/perfil')">
              <q-item-section avatar>
                <q-icon name="account_circle" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Meu Perfil</q-item-label>
                <q-item-label caption>Editar informações</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="shopping_bag" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Meus Pedidos</q-item-label>
                <q-item-label caption>Acompanhar compras</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="logout" color="negative" />
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
      :width="320"
      class="bg-grey-10 text-white ecommerce-drawer"
    >
      <div class="drawer-header">
        <div class="user-profile q-pa-lg">
          <q-avatar size="64px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold text-h6">{{ userName }}</div>
          <div class="text-caption text-grey-4">{{ userEmail }}</div>
          <q-chip color="positive" text-color="white" size="sm" icon="verified" class="q-mt-sm">
            Cliente VIP
          </q-chip>
        </div>
      </div>

      <q-scroll-area style="height: calc(100% - 180px); margin-top: 180px; width: 100%;">
        <q-list padding>
          <q-item-label header class="text-grey-4 text-weight-bold section-header">
            <q-icon name="store" class="q-mr-sm" />
            🛒 LOJA VIRTUAL
          </q-item-label>

          <EssentialLink
            v-for="link in linksList.filter(l => !l.adminOnly)"
            :key="link.title"
            v-bind="link"
          />

          <q-separator class="q-my-md separator-glow" />

          <q-item-label header class="text-grey-4 text-weight-bold section-header">
            <q-icon name="admin_panel_settings" class="q-mr-sm" />
            🔧 PAINEL ADMIN
          </q-item-label>

          <EssentialLink
            v-for="link in linksList.filter(l => l.adminOnly)"
            :key="link.title"
            v-bind="link"
          />

          <q-separator class="q-my-md separator-glow" />

          <q-item-label header class="text-grey-4 text-weight-bold section-header">
            <q-icon name="local_fire_department" class="q-mr-sm" />
            🔥 OFERTAS ESPECIAIS
          </q-item-label>

          <q-item class="promo-item">
            <q-item-section avatar>
              <img src="~/assets/hot-sale.gif" style="width: 32px; height: 32px;" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-orange">Mega Promoção!</q-item-label>
              <q-item-label caption>Até 70% OFF</q-item-label>
            </q-item-section>
          </q-item>
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
  { title: '🏠 Início', caption: 'Página principal • Ofertas do dia', icon: 'storefront', to: '/', badge: 'NOVO', badgeColor: 'positive' },
  { title: '🛍️ Produtos', caption: 'Catálogo completo • +1000 itens', icon: 'inventory_2', to: '/produtos', badge: 'HOT', badgeColor: 'negative' },
  { title: '📊 Dashboard', caption: 'Painel administrativo • Métricas', icon: 'dashboard', to: '/dashboard', adminOnly: true },
  { title: '💰 Vendas', caption: 'Gestão de pedidos • Faturamento', icon: 'point_of_sale', to: '/vendas', adminOnly: true },
  { title: '👥 Clientes', caption: 'Base de usuários • CRM integrado', icon: 'people', to: '/clientes', adminOnly: true },
  { title: '📈 Relatórios', caption: 'Analytics • Business Intelligence', icon: 'analytics', to: '/relatorios', adminOnly: true },
  { title: '⚙️ Configurações', caption: 'Personalização • Preferências', icon: 'tune', to: '/configuracoes', adminOnly: true }
];

// Controle do drawer
const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="scss">
.ecommerce-header {
  background: linear-gradient(135deg, #5b21b6 0%, #818cf8 100%) !important;
  
  .brand-text {
    font-size: 1.5rem;
    font-weight: 800;
    margin-left: 0.5rem;
  }
  
  .sale-chip {
    animation: pulse 2s infinite;
    margin-left: 0.5rem;
  }
  
  .search-input {
    border-radius: 25px;
  }
  
  .cart-btn, .wishlist-btn, .notification-btn {
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  .hot-sale-logo {
    border-radius: 50%;
  }
}

.ecommerce-drawer {
  .drawer-header {
    background: linear-gradient(135deg, #5b21b6 0%, #818cf8 100%);
    
    .user-profile {
      text-align: center;
    }
  }
  
  .section-header {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    padding: 0.5rem 1rem;
    background: rgba(91, 33, 182, 0.1);
    border-radius: 6px;
    margin: 0.5rem;
  }
  
  .separator-glow {
    background: linear-gradient(90deg, transparent, #818cf8, transparent);
    height: 1px;
    border: none;
  }
  
  .nav-item {
    margin: 0.25rem 0.5rem;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    min-height: 56px;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }
    
    &:hover {
      background: rgba(129, 140, 248, 0.15);
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(91, 33, 182, 0.2);
      
      &::before {
        left: 100%;
      }
      
      .nav-icon {
        transform: scale(1.1) rotate(5deg);
        color: #818cf8;
      }
      
      .nav-title {
        color: #ffffff;
        font-weight: 600;
      }
    }
    
    &:focus {
      outline: 2px solid #818cf8;
      outline-offset: 2px;
    }
  }
  
  .nav-icon {
    transition: all 0.3s ease;
    font-size: 1.5rem;
  }
  
  .nav-title {
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }
  
  .nav-caption {
    font-size: 0.75rem;
    color: #9ca3af !important;
    line-height: 1.3;
    white-space: normal;
    word-wrap: break-word;
    max-width: 100%;
  }
  
  .nav-badge {
    font-size: 0.65rem;
    font-weight: 700;
    min-width: 35px;
    animation: pulse-badge 2s infinite;
  }
  
  .promo-item {
    background: rgba(255, 152, 0, 0.1);
    border-radius: 12px;
    margin: 0.5rem;
    border: 1px solid rgba(255, 152, 0, 0.3);
    
    &:hover {
      background: rgba(255, 152, 0, 0.2);
      transform: scale(1.02);
    }
  }
  
  .q-item--active {
    background: linear-gradient(135deg, #5b21b6, #818cf8) !important;
    color: white;
    border-radius: 12px;
    margin: 0.25rem 0.5rem;
    box-shadow: 0 4px 12px rgba(91, 33, 182, 0.4);
    
    .nav-icon {
      color: white;
      transform: scale(1.1);
    }
    
    .nav-title {
      color: white;
      font-weight: 600;
    }
    
    .nav-caption {
      color: rgba(156, 163, 175, 0.9) !important;
    }
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse-badge {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(91, 33, 182, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(91, 33, 182, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(91, 33, 182, 0);
  }
}

/* Acessibilidade - Modo de alto contraste */
@media (prefers-contrast: high) {
  .nav-item {
    border: 2px solid #ffffff;
    
    &:hover {
      background: #ffffff;
      color: #000000;
    }
  }
}

/* Acessibilidade - Redução de movimento */
@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .nav-icon,
  .nav-badge {
    animation: none;
    transition: none;
  }
}
</style>
