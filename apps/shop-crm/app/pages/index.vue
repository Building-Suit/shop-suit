<script setup lang="ts">
definePageMeta({
  layout: 'landing',
});

const sections = [
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
  <LandingHero />

  <LandingSocialProofBar />

  <div
    v-for="section in sections"
    :key="section.id"
    :id="section.id"
    class="h-screen w-full flex flex-col items-center justify-center"
  >
    <h1 class="text-4xl font-bold text-secondary">{{ section.title }}</h1>
  </div>
</template>
