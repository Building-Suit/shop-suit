<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  color?: string;
}>();
</script>

<template>
  <div
    class="p-4 rounded-lg shadow bg-white dark:bg-gray-900 border-l-4"
    :class="{
      'border-blue-500': color === 'blue',
      'border-red-500': color === 'red',
      'border-green-500': color === 'green',
      'border-purple-500': color === 'purple',
      'border-orange-500': color === 'orange',
      'border-yellow-500': color === 'yellow',
      'border-indigo-500': color === 'indigo',
    }"
  >
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
    <p class="text-2xl font-bold mt-1">{{ value }}</p>
  </div>
</template>
