<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950">
    <LandingHeader />

    <main class="flex flex-col flex-1 bg-background">
      <slot />
    </main>

    <LandingFooter />
  </div>
</template>
