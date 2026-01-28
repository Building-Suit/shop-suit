<script setup lang="ts">
import { NuxtLink } from '#components';

const navLinks = [
  { label: 'Features', to: '#features' },
  { label: 'Pricing', to: '#pricing' },
  { label: 'FAQs', to: '#faqs' },
];
</script>

<template>
  <!-- Simple top nav -->
  <header
    :class="[
      'w-full border-b dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur',
      'fixed top-0 z-50',
    ]"
  >
    <div class="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
      <NuxtLink to="/" class="flex flex-col items-center">
        <span class="font-extrabold text-xl tracking-tight text-primary">
          Shop CRM
        </span>
        <span class="text-xs opacity-70 tracking-tight">
          by <strong>Building Suit</strong>
        </span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <Button
          v-for="link in navLinks"
          :key="link.to"
          :as="NuxtLink"
          :to="link.to"
          variant="ghost"
          class="text-muted-foreground"
        >
          {{ link.label }}
        </Button>
      </div>

      <div class="flex items-center gap-2">
        <Button :as="NuxtLink" to="/auth/login" variant="ghost"> Login </Button>

        <Button :as="NuxtLink" to="#pricing" variant="secondary">
          Start Free Trial
        </Button>
      </div>
    </div>
  </header>
</template>
