<script setup lang="ts">
</script>

<template>
  <section class="py-16 px-4 bg-white dark:bg-gray-950">
    <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 class="text-3xl font-bold mb-4">{{ $t('problem') }}</h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
          {{ $t('runningAShopIsHard') }}
        </p>

        <p class="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
          <strong>{{ $t('solution') }}</strong>
          {{ $t('weFixAllOfThat') }}
        </p>
      </div>

      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/8771/8771926.png"
          alt=""
          class="w-80 mx-auto opacity-90"
        />
      </div>
    </div>
  </section>
</template>