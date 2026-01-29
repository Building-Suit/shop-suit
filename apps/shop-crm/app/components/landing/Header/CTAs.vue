<script setup lang="ts">
import { NuxtLink } from '#components';

const { isMenuOpen } = useNavigation();
</script>

<template>
  <div>
    <LanguageSwitcher />

    <Button
      :as="NuxtLink"
      to="/auth/login"
      variant="outline"
      @click="isMenuOpen = false"
    >
      Login
    </Button>

    <Button
      :as="NuxtLink"
      to="#pricing"
      variant="secondary"
      @click="isMenuOpen = false"
    >
      Start Free Trial
    </Button>
  </div>
</template>
