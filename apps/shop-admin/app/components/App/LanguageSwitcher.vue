<script lang="ts" setup>
const { locale, setLocale, locales } = useI18n();
const availableLocale = computed(() =>
  locales.value.find(l => l.code !== locale.value)
);
</script>

<template>
  <Avatar
    :image="String(availableLocale?.flag)"
    shape="circle"
    class="cursor-pointer"
    @click="() => setLocale(availableLocale?.code as 'en' | 'ar')"
  />
</template>

<style scoped></style>
