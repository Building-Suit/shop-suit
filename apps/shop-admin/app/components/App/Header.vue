<script lang="ts" setup>
const emit = defineEmits(['toggle-mobile']); // NEW

const { collapsed, pageTitle } = storeToRefs(useLayoutStore());

const toggleSidebar = () => (collapsed.value = !collapsed.value);
</script>

<template>
  <header
    class="h-16 bg-white shadow-md text-gray-900 dark:bg-zinc-900 dark:text-white rounded-lg flex items-center justify-between px-4 md:px-6"
  >
    <!-- LEFT AREA -->
    <div class="flex items-center gap-4">
      <!-- MOBILE MENU BUTTON -->
      <!-- <Button
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        @click="() => emit('toggle-mobile')"
      /> -->
      <Button
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        size="large"
        @click="toggleSidebar"
      />

      <!-- PAGE TITLE -->
      <h1 class="text-xl font-semibold" v-text="pageTitle" />
    </div>

    <!-- RIGHT AREA -->
    <div class="flex items-center gap-4">
      <AppLanguageSwitcher />

      <AppColorModeSwitcher />
    </div>
  </header>
</template>
