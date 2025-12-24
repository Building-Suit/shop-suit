<script setup>
defineProps(['icon', 'title', 'desc']);
</script>

<template>
  <div
    class="p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-slate-200 dark:border-slate-800"
  >
    <i :class="['pi', icon, 'text-3xl text-blue-600']"></i>
    <h3 class="font-semibold mt-3">{{ title }}</h3>
    <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ desc }}</p>
  </div>
</template>
