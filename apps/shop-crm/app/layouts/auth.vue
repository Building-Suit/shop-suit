<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <!-- Brand panel (hidden on mobile) -->
    <div class="relative hidden overflow-hidden bg-primary-dark lg:block">
      <div class="absolute inset-0 hero-dots opacity-30"></div>
      <div class="relative z-10 flex h-full flex-col justify-between p-10">
        <NuxtLink to="/" class="flex flex-col">
          <span class="text-xl font-extrabold tracking-tight text-secondary">
            Shop CRM
          </span>
          <span class="text-xs tracking-tight text-primary-foreground/70">
            by <strong>Building Suit</strong>
          </span>
        </NuxtLink>

        <div class="flex flex-col gap-4">
          <p class="max-w-sm text-headline-sm text-primary-foreground">
            {{ $t('hero.title') }}
            <span class="text-secondary">{{ $t('hero.subtitle') }}</span>
          </p>
          <p class="max-w-sm text-body-md text-primary-foreground/70">
            {{ $t('hero.description') }}
          </p>
        </div>

        <p class="text-label-md text-primary-foreground/50">
          © {{ new Date().getFullYear() }} Shop CRM —
          {{ $t('footer.allRightsReserved') }}
        </p>
      </div>
    </div>

    <!-- Form panel -->
    <div class="flex items-center justify-center bg-background p-6">
      <div class="flex w-full flex-col gap-6">
        <div class="flex items-center justify-between lg:hidden">
          <NuxtLink to="/" class="flex flex-col">
            <span class="text-lg font-extrabold tracking-tight text-primary">
              Shop CRM
            </span>
            <span class="text-xs text-muted-foreground">
              by <strong>Building Suit</strong>
            </span>
          </NuxtLink>
          <ThemeToggle />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
