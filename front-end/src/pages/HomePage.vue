<template>
  <q-page class="flex flex-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div class="text-center">
      <div class="text-6xl mb-4">🏪</div>
      <h1 class="text-h3 text-weight-bold text-primary mb-4">
        Bem-vindo ao By Sales Admin
      </h1>
      <p class="text-subtitle1 text-grey-7 mb-6">
        Painel administrativo para gerenciar sua loja online
      </p>
      <q-btn
        color="primary"
        size="lg"
        label="Ir para Dashboard"
        to="/dashboard"
        unelevated
        class="q-px-xl"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
//
</script>

<style scoped>
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #eff6ff, #faf5ff);
}
</style>