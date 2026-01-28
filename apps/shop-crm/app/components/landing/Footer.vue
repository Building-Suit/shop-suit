<script setup lang="ts"></script>

<template>
  <footer class="bg-primary-dark! text-primary-foreground py-16">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div class="flex flex-col gap-6">
          <NuxtLink to="/" class="flex flex-col">
            <span class="font-extrabold text-xl tracking-tight text-secondary">
              Shop CRM
            </span>
            <span class="text-xs opacity-70 tracking-tight">
              by <strong>Building Suit</strong>
            </span>
          </NuxtLink>

          <p class="text-sm leading-relaxed text-muted-foreground">
            The all-in-one CRM for Egyptian small businesses. Invoices,
            employees, expenses, and inventory — all in one place.
          </p>
        </div>

        <div class="flex flex-col gap-6">
          <h3 class="font-semibold text-lg">Product</h3>
          <ul class="flex flex-col gap-2 text-muted-foreground">
            <li>
              <NuxtLink to="#features" class="hover:underline">
                Features
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#pricing" class="hover:underline">
                Pricing
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-6">
          <h3 class="font-semibold text-lg">Company</h3>
          <ul class="flex flex-col gap-2 text-muted-foreground">
            <li>
              <NuxtLink to="/about" class="hover:underline">
                About Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="hover:underline">
                Contact
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-6">
          <h3 class="font-semibold text-lg">Legal</h3>
          <ul class="flex flex-col gap-2 text-muted-foreground">
            <li>
              <NuxtLink to="/privacy-policy" class="hover:underline">
                Privacy Policy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms-of-service" class="hover:underline">
                Terms of Service
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex items-center justify-between border-t border-primary-foreground/10 pt-8"
      >
        <span>
          © {{ new Date().getFullYear() }} Shop CRM
          <small>by <strong>Building Suit</strong></small>
          . All rights reserved.
        </span>

        Language Switcher
      </div>
    </div>
  </footer>
</template>
