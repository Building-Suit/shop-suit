<script setup lang="ts">
</script>

<template>
  <section class="py-16 px-4 bg-slate-50 dark:bg-gray-900">
    <div class="max-w-5xl mx-auto text-center mb-10">
      <h2 class="text-3xl font-bold mb-2">{{ $t('testimonials') }}</h2>
      <p class="text-slate-600 dark:text-slate-300">
        {{ $t('whatOurUsersSay') }}
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <Testimonial
        :quote="$t('testimonial1')"
        :name="$t('testimonial1Name')"
        :role="$t('testimonial1Role')"
      />
      <Testimonial
        :quote="$t('testimonial2')"
        :name="$t('testimonial2Name')"
        :role="$t('testimonial2Role')"
      />
      <!-- <Testimonial
        :quote="$t('testimonial3')"
        :name="$t('testimonial3Name')"
        :role="$t('testimonial3Role')"
      /> -->
    </div>
  </section>
</template>