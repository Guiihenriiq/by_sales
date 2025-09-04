<template>
  <div class="state-container">
    <transition name="fade" mode="out-in">
      <div :key="currentState" v-html="states[currentState]?.template || currentState"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  states: Record<string, any>;
  currentState: string;
}

defineProps<Props>();
</script>

<style scoped>
.state-container {
  min-height: 200px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>