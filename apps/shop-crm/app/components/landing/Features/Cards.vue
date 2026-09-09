<script setup lang="ts">
const features = [
  {
    icon: 'lucide:file-text',
    iconColorClass: 'bg-blue-500/10 text-blue-600',
    title: 'invoicesAndServices.title',
    description: 'invoicesAndServices.description',
    description2: 'invoicesAndServices.description2',
  },
  {
    icon: 'lucide:users',
    iconColorClass: 'bg-purple-500/10 text-purple-600',
    title: 'employeesManagement.title',
    description: 'employeesManagement.description',
    description2: 'employeesManagement.description2',
  },
  {
    icon: 'lucide:chart-line',
    iconColorClass: 'bg-green-500/10 text-green-600',
    title: 'dashboardAndReports.title',
    description: 'dashboardAndReports.description',
    description2: 'dashboardAndReports.description2',
  },
  {
    icon: 'lucide:wallet',
    iconColorClass: 'bg-orange-500/10 text-orange-600',
    title: 'expensesTracking.title',
    description: 'expensesTracking.description',
    description2: 'expensesTracking.description2',
  },
];
</script>

<template>
  <div
    v-for="feature in features"
    :key="feature.title"
    :class="[
      'flex flex-col gap-6',
      'bg-card rounded-2xl p-8 shadow',
      'hover:shadow-xl hover:scale-[1.01] hover:bg-linear-to-br from-secondary/10 to-card',
      'transition-all duration-300',
    ]"
  >
    <div
      :class="[
        'rounded-lg p-3 flex items-center justify-center w-fit',
        feature.iconColorClass,
      ]"
    >
      <Icon :name="feature.icon" class="size-8" />
    </div>
    <h3 class="text-xl font-bold text-foreground">
      {{ $t(`features.${feature.title}`) }}
    </h3>

    <div class="flex flex-col gap-2">
      <p class="text-muted-foreground leading-relaxed">
        {{ $t(`features.${feature.description}`) }}
      </p>
      <p class="text-xs text-muted-foreground">
        {{ $t(`features.${feature.description2}`) }}
      </p>
    </div>
  </div>
</template>
