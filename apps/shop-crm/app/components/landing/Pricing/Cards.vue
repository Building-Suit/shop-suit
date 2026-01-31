<script setup lang="ts">
const plans = [
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
        plan.name === 'Pro' && 'bg-primary text-primary-foreground',
        ' rounded-xl p-8 shadow-sm border border-border',
        'flex flex-col gap-12 justify-between',
      ]"
    >
      <div
        v-if="plan.name === 'Pro'"
        class="absolute top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Badge class="text-sm px-3 py-1" variant="secondary">
          <Icon name="lucide:stars" />
          Most Popular
        </Badge>
      </div>

      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <h3 class="text-xl font-bold">{{ plan.name }}</h3>
          <p
            :class="[
              plan.name === 'Pro'
                ? 'text-primary-foreground/80'
                : 'text-muted-foreground',
            ]"
          >
            {{ plan.description }}
          </p>
        </div>

        <div class="flex items-baseline gap-1">
          <span class="text-5xl font-bold">
            {{ useNumberFormat(plan.price) }}
          </span>
          <span :class="[plan.name === 'Pro' && 'text-primary-foreground/80']">
            EGP
          </span>
          <span :class="[plan.name === 'Pro' && 'text-primary-foreground/60']">
            /month
          </span>
        </div>

        <Badge :variant="plan.name === 'Pro' ? 'secondary' : 'default'">
          30-Day Free Trial
        </Badge>

        <ul class="flex flex-col gap-2">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="flex gap-3 items-center"
          >
            <Icon name="lucide:check" class="text-secondary" />
            {{ feature }}
          </li>
        </ul>
      </div>

      <Button
        size="lg"
        :variant="plan.name === 'Pro' ? 'secondary' : 'outline'"
      >
        Get Started
      </Button>
    </div>
  </div>
</template>
