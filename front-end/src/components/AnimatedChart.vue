<template>
  <div class="animated-chart">
    <div class="chart-title">{{ title }}</div>
    <div ref="chartContainer" class="chart-container">
      <div 
        v-for="(item, index) in data" 
        :key="index"
        class="chart-bar"
        :style="{ backgroundColor: colors[index % colors.length] }"
      >
        <div class="bar-value">{{ item.value }}</div>
        <div class="bar-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

interface ChartData {
  label: string;
  value: number;
}

interface Props {
  title: string;
  data: ChartData[];
  colors?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ['#5b21b6', '#818cf8', '#a855f7', '#c084fc', '#e879f9']
});

const chartContainer = ref();

onMounted(() => {
  if (chartContainer.value) {
    const bars = chartContainer.value.querySelectorAll('.chart-bar');
    const maxValue = Math.max(...props.data.map(d => d.value));
    
    gsap.fromTo(bars, 
      { height: 0, opacity: 0 },
      { 
        height: (i: number) => `${(props.data[i].value / maxValue) * 200}px`,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
    
    gsap.fromTo('.bar-value', 
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 1 }
    );
  }
});
</script>

<style scoped>
.animated-chart {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.chart-container {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 250px;
  padding: 1rem 0;
}

.chart-bar {
  flex: 1;
  position: relative;
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.bar-value {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.25rem;
}

.bar-label {
  position: absolute;
  bottom: -2rem;
  font-size: 0.8rem;
  color: #6b7280;
  white-space: nowrap;
}
</style>