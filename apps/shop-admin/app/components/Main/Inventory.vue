<script setup lang="ts">
</script>

<template>
  <section class="py-16 px-4 bg-white dark:bg-gray-950">
    <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
          class="w-80 mx-auto opacity-90"
        />
      </div>

      <div>
        <h2 class="text-3xl font-bold mb-4">{{ $t('inventoryFeature') }}</h2>

        <p class="text-slate-600 dark:text-slate-300 mb-3">
          {{ $t('manageYourStockWithFIFO') }}
        </p>

        <ul class="space-y-2 text-slate-700 dark:text-slate-300">
          <li>✓ {{ $t('inventoryFeature01') }}</li>
          <li>✓ {{ $t('inventoryFeature02') }}</li>
          <li>✓ {{ $t('inventoryFeature03') }}</li>
          <li>✓ {{ $t('inventoryFeature04') }}</li>
          <!-- <li>✓ {{ $t('inventoryFeature05') }}</li> -->
        </ul>
      </div>
    </div>
  </section>
</template>