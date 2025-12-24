<script setup>
defineProps(['quote', 'name', 'role']);
</script>

<template>
  <div
    class="p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-slate-200 dark:border-slate-800"
  >
    <p class="italic text-slate-700 dark:text-slate-300">“{{ quote }}”</p>
    <p class="mt-3 font-semibold">{{ name }}</p>
    <p class="text-xs text-slate-500">{{ role }}</p>
  </div>
</template>
