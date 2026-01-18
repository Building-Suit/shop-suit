<script setup lang="ts">
import Chart from 'primevue/chart';

defineProps<{ type: 'bar' | 'line'; data: any }>();

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <Chart class="h-96" :type :data :options="chartOptions" />
</template>
