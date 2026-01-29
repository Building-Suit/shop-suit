<script setup lang="ts"></script>

<template>
  <div id="features" class="bg-muted py-36 flex flex-col gap-12">
    <div class="text-center flex flex-col items-center max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
        {{ $t('features.title') }}
        <span class="text-secondary">{{ $t('features.subtitle') }}</span>
      </h1>

      <p class="mt-4 text-lg text-muted-foreground">
        {{ $t('features.description') }}
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto w-full">
      <LandingFeaturesCards />
    </div>
  </div>
</template>
