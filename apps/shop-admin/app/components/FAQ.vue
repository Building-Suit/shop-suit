<script setup>
const props = defineProps(['q', 'a']);
</script>

<template>
  <details
    class="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-4"
  >
    <summary class="font-semibold cursor-pointer">{{ q }}</summary>
    <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">{{ a }}</p>
  </details>
</template>
