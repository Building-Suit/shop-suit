<script setup lang="ts">

const emit = defineEmits<{
  (e: "plan", _plan: any): void
}>()

const subStore = useSubscriptionStore();
const { plans } = storeToRefs(subStore);
subStore.getPlans();

const formatPrice = (p: number, c: string) =>{
  return computed(() => `${useFormatPrice(p)} ${$t(c)}/${$t('month')}`);
}
</script>

<template>
  <section id="pricing" class="py-20 px-4 bg-white dark:bg-gray-950">
    <div class="max-w-5xl mx-auto text-center mb-10">
      <h2 class="text-3xl font-bold">{{ $t('pricing') }}</h2>
      <p class="text-slate-600 dark:text-slate-300 mt-1">
        {{ $t('chooseThePlanThatFits') }}
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div
        v-for="plan in plans.data"
        :key="plan.id"
        :class="['relative overflow-hidden', 'flex flex-col gap-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-slate-800 shadow-lg p-6', plan.key === 'pro' && 'ring-2 ring-blue-500 md:scale-105']"
      >
        <!-- coming soon flag -->
        <div v-if="plan.soon" :class="['absolute top-9 -end-8 rtl:-rotate-45 ltr:rotate-45 w-40 text-center', 'bg-red-500 text-white px-6']">
          {{ $t('comingSoon') }}
        </div>
         

        <h3 :class="['text-xl font-bold', plan.soon && 'blur']">{{ $t(plan.key) }}</h3>
        <p :class="['text-sm text-slate-600 dark:text-slate-400', plan.soon && 'blur']">
          {{ $t(`${plan.key}Description`) }}
        </p>

        <div class="flex flex-col items-start justify-between gap-1">
          <p :class="['text-3xl font-extrabold', plan.soon && 'blur']" v-text="formatPrice(plan.price_monthly, plan.currency.toLowerCase())" />

          <span
            v-if="plan.trial_days > 0"
            class="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-3 py-1 rounded-full"
          >
            {{ plan.trial_days }} - {{ $t('dayFreeTrial') }}
          </span>
        </div>

        <ul :class="['mt-auto text-sm space-y-1 text-slate-600 dark:text-slate-300', plan.soon && 'blur']">
          <li>✓ {{ $t('coreFeatures') }}</li>

          <li>
            {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
            {{ $t('inventoryFeature01') }}
          </li>
          <li>
            {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
            {{ $t('inventoryFeature02') }}
          </li>
          <li>
            {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
            {{ $t('inventoryFeature03') }}
          </li>
          <li>
            {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
            {{ $t('inventoryFeature04') }}
          </li>
        </ul>

        <button
          :class="['mt-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700', plan.soon && 'blur']"
          :disabled="plan.soon"
          @click="() => !plan.soon && emit('plan', plan)"
        >
          {{ $t('choose') }} {{ $t(plan.key) }}
        </button>
      </div>
    </div>
  </section>
</template>