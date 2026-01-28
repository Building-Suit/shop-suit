<script setup lang="ts">
definePageMeta({
  layout: 'landing',
});

const sections = [
  {
    id: '',
    title: 'Hero',
  },
  {
    id: 'features',
    title: 'Features',
  },
  {
    id: 'pricing',
    title: 'Pricing',
  },
  {
    id: 'faqs',
    title: 'FAQs',
  },
];
</script>

<template>
  <template v-for="section in sections" :key="section.id">
    <LandingHeroBackground
      v-if="section.id === ''"
      :id="section.id"
      class="h-screen w-full flex flex-col items-center justify-center"
    >
      <h1 class="text-4xl font-bold text-secondary">{{ section.title }}</h1>
    </LandingHeroBackground>

    <div
      v-else
      :id="section.id"
      class="h-screen w-full flex flex-col items-center justify-center"
    >
      <h1 class="text-4xl font-bold text-secondary">{{ section.title }}</h1>
    </div>
  </template>
</template>
