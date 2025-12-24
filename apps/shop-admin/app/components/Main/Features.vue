<script setup lang="ts">
</script>

<template>
  <section
    class="py-16 px-4 bg-slate-50 dark:bg-gray-900 border-y border-slate-200/50 dark:border-gray-800"
  >
    <div class="max-w-5xl mx-auto text-center mb-10">
      <h2 class="text-3xl font-bold mb-2">
        {{ $t('allTheFeaturesYouNeed') }}
      </h2>
      <p class="text-slate-600 dark:text-slate-300">
        {{ $t('designedForSmallBusiness') }}
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <FeatureCard
        icon="pi pi-receipt"
        :title="$t('invoicesFeature')"
        :desc="$t('createProfessionalInvoices')"
      />
      <FeatureCard
        icon="pi pi-users"
        :title="$t('employeeManagement')"
        :desc="$t('manageEmployeePermissions')"
      />
      <FeatureCard
        icon="pi pi-chart-line"
        :title="$t('analyticsFeature')"
        :desc="$t('detailedSalesReports')"
      />
      <!-- <FeatureCard
        icon="pi pi-shop"
        :title="$t('multipleShops')"
        :desc="$t('manageMultipleShops')"
      /> -->
      <FeatureCard
        icon="pi pi-dollar"
        :title="$t('expensesFeature')"
        :desc="$t('trackYourExpenses')"
      />
      <FeatureCard
        icon="pi pi-database"
        :title="$t('inventoryFeature')"
        :desc="$t('fifoInventoryTracking')"
      />
    </div>
  </section>
</template>