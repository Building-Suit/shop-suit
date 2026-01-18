<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950">
    <!-- Simple top nav -->
    <header
      :class="['w-full border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur', 'sticky top-0 z-50']"
    >
      <div
        class="max-w-5xl mx-auto flex items-center justify-between px-4 py-3"
      >
        <NuxtLink to="/" class="flex flex-col items-center">
          <span class="font-bold text-lg tracking-tight">Shop CRM</span>
          <span class="text-xs opacity-70 tracking-tight">by <strong>Building Suit</strong></span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <!-- <NuxtLink to="/auth/login" class="text-sm hover:underline">
            Login
          </NuxtLink> -->

          <NuxtLink
            to="#pricing"
            class="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {{ $t("let'sGetStarted") }}
          </NuxtLink>

          <AppLanguageSwitcher />
          <AppColorModeSwitcher />
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex flex-col flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-slate-200 dark:border-gray-800 py-4 mt-8 text-center text-xs text-slate-500"
    >
      © {{ new Date().getFullYear() }} Shop CRM <small>by <strong>Building Suit</strong></small>. All rights reserved.
    </footer>
  </div>
</template>
