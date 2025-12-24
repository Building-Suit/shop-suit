<script lang="ts" setup></script>

<template>
  <div
    v-for="mode in [
      { label: 'Light', icon: 'pi-sun', switchTo: 'dark' },
      { label: 'Dark', icon: 'pi-moon', switchTo: 'light' },
    ]"
    :class="[
      mode.label === 'Light' ? 'block dark:hidden' : 'hidden dark:block',
      'cursor-pointer',
      'flex items-center justify-center',
      'size-10 p-2 rounded-full',
      'hover:bg-gray-200 dark:hover:bg-gray-700',
      'transition-colors ease-in-out duration-300',
    ]"
    @click="() => ($colorMode.preference = mode.switchTo)"
  >
    <i :class="['pi text-2xl', mode.icon]" />
  </div>
</template>

<style scoped></style>
