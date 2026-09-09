<script setup lang="ts">
const { data: plans, isLoading, error } = usePlans();

const plansStatic = [
  {
    name: 'Starter',
    description: 'Perfect for getting started',
    price: 800,
    features: [
      'Up to 50 customers',
      'Basic reporting',
      'Email support',
      'Basic reporting',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    description: 'For growing businesses',
    price: 1200,
    features: [
      'Unlimited customers',
      'Advanced reporting',
      'Priority support',
      'Advanced reporting',
      'Priority support',
      'Priority support',
      'Priority support',
    ],
  },
];
</script>

<template>
  <div class="w-full md:w-3/4 grid lg:grid-cols-2 gap-8">
    <div
      v-for="plan in plans"
      :key="plan.name"
      :class="[
        'relative',
        plan.slug === 'pro' && 'bg-primary text-primary-foreground',
        ' rounded-xl p-8 shadow-sm border border-border',
        'flex flex-col gap-12 justify-between',
      ]"
    >
      <div
        v-if="plan.slug === 'pro'"
        class="absolute top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Badge class="text-sm px-3 py-1" variant="secondary">
          <Icon name="lucide:stars" />
          {{ $t('pricing.mostPopular') }}
        </Badge>
      </div>

      <div class="flex flex-col gap-6">
        <h3 class="text-xl font-bold">{{ plan.name }}</h3>

        <div class="flex items-baseline gap-1">
          <span class="text-5xl font-bold">
            {{ useNumberFormat(plan.price_amount) }}
          </span>
          <span :class="[plan.slug === 'pro' && 'text-primary-foreground/80']">
            {{ $t(`pricing.${plan.currency}`) }}
          </span>
          <span :class="[plan.slug === 'pro' && 'text-primary-foreground/60']">
            /{{ $t(`pricing.${plan.billing_interval}`) }}
          </span>
        </div>

        <Badge :variant="plan.slug === 'pro' ? 'secondary' : 'default'">
          {{ $t('pricing.trial', { trialDays: plan.trial_days }) }}
        </Badge>

        <ul class="flex flex-col gap-2">
          <li
            v-for="feature in $tm('pricing.features')"
            :key="feature"
            class="flex gap-3 items-center"
          >
            <Icon name="lucide:check" class="text-secondary" />
            {{ feature }}
          </li>
          <li
            v-for="feature in $tm('pricing.inventoryFeatures')"
            :key="feature"
            class="flex gap-3 items-center"
          >
            <Icon
              v-if="plan.features.inventory"
              name="lucide:check"
              class="text-secondary"
            />
            <Icon v-else name="lucide:x" class="text-muted-foreground" />
            {{ feature }}
          </li>
        </ul>
      </div>

      <Button
        size="lg"
        :variant="plan.slug === 'pro' ? 'secondary' : 'outline'"
      >
        {{ $t('pricing.cta') }}
      </Button>
    </div>
  </div>
</template>
