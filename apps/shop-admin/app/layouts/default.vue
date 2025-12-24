<script setup lang="ts">
import { Drawer } from 'primevue';

const { isMobile, collapsed } = storeToRefs(useLayoutStore());

const { authUser } = storeToRefs(useAuthStore());

const { localeProperties } = useI18n();
</script>

<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-zinc-950 p-4 gap-4"
  >
    <!-- Mobile Drawer / Desktop Sidebar -->
    <component
      :is="isMobile ? Drawer : 'div'"
      v-model:visible="collapsed"
      :position="localeProperties.dir === 'rtl' ? 'right' : 'left'"
      :header="authUser?.shopName?.toUpperCase()"
      :class="[isMobile && 'w-64']"
    >
      <AppSideMenu />
    </component>

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header (now has hamburger) -->
      <AppHeader @toggle-mobile="() => (collapsed = true)" />

      <main class="py-4 px-1 flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
