<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

defineProps<{
  items: {
    product_id: string;
    product_name: string;
    revenue: number;
    cogs: number;
    profit: number;
  }[];
}>();
</script>

<template>
  <DataTable :value="items" stripedRows responsiveLayout="scroll">
    <Column field="product_name" :header="$t('name')" />
    <Column field="revenue" :header="$t('revenue')" />
    <Column field="cogs" :header="$t('cogs')" />
    <Column field="profit" :header="$t('profit')" />

    <template #empty>
      <div class="flex items-center justify-center">
        <span>{{ $t('noData') }}</span>
      </div>
    </template>
  </DataTable>
</template>
