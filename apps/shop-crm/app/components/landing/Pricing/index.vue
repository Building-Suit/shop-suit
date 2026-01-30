<script setup lang="ts"></script>

<template>
  <div id="pricing" class="bg-muted/40 py-36">
    <div
      :class="[
        'max-w-6xl mx-auto px-4',
        'flex flex-col gap-10 items-center justify-center',
      ]"
    >
      <div class="flex flex-col gap-4 items-center justify-center text-center">
        <h2 class="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
          {{ $t('pricing.title') }}
          <span class="text-secondary">{{ $t('pricing.subtitle') }}</span>
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl">
          {{ $t('pricing.description') }}
        </p>
      </div>

      <!-- Pricing Cards -->
      <LandingPricingCards />
    </div>
  </div>
</template>
