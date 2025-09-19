<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  // Inicializar autenticação
  authStore.initializeAuth();
  
  // Se não estiver autenticado e não estiver na página de login, redirecionar
  if (!authStore.isAuthenticated && router.currentRoute.value.path !== '/login') {
    router.push('/login');
  }
});
</script>
