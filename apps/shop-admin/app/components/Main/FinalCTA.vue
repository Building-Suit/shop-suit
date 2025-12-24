<template>
  <section class="py-20 text-center bg-white dark:bg-gray-950">
    <h2 class="text-3xl font-bold mb-4">{{ $t('getStarted') }}</h2>
    <p class="text-slate-600 dark:text-slate-300 mb-6">
      {{ $t('readyToManageYourShop') }}
    </p>

    <NuxtLink
      to="#pricing"
      class="px-8 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
    >
      {{ $t('chooseAPlan') }}
    </NuxtLink>
  </section>
</template>