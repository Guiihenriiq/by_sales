<template>
  <div v-if="show" class="loading-overlay">
    <div class="loading-spinner"></div>
    <div class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: 'Carregando...'
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid transparent;
  border-top: 4px solid #5b21b6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: white;
  font-size: 1.2rem;
  margin-top: 2rem;
  font-weight: 500;
}
</style>