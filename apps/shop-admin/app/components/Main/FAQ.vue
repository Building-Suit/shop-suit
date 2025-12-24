<template>
  <section class="py-16 px-4 bg-slate-50 dark:bg-gray-900">
    <div class="max-w-5xl mx-auto text-center mb-10">
      <h2 class="text-3xl font-bold">{{ $t('faq') }}</h2>
    </div>

    <div class="max-w-4xl mx-auto space-y-4">
      <FAQ :q="$t('faq1Question')" :a="$t('faq1Answer')" />
      <FAQ :q="$t('faq2Question')" :a="$t('faq2Answer')" />
      <FAQ :q="$t('faq3Question')" :a="$t('faq3Answer')" />
      <!-- <FAQ :q="$t('faq4Question')" :a="$t('faq4Answer')" /> -->
    </div>
  </section>
</template>