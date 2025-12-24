<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'login'): void
  }>()
</script>

<template>
  <section
      class="hero py-20 text-center px-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      <h1
        class="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto"
      >
        {{ $t('manageYourShopWith') }}
        <span class="text-blue-600">{{ $t('claritySpeed') }}</span>
        {{ $t('&') }}
        <span class="text-emerald-600">{{ $t('confidence') }}</span>
      </h1>

      <p
        class="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto"
      >
        {{ $t('allInOneCRMForSmallShops') }}
      </p>

      <div class="flex justify-center gap-4 mt-8">
        <!-- Smooth scroll to pricing -->
        <NuxtLink
          to="#pricing"
          class="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow"
        >
          {{ $t('chooseAPlan') }}
        </NuxtLink>

        <Button
          type="button"
          :label="$t('login')"
          outlined
          class="rounded-xl text-sm font-medium px-6 py-3"
          @click="() => emit('login')"
        />
      </div>
    </section>
</template>