// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxtjs/i18n',
  ],

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui',
  },

  i18n: {
    strategy: 'no_prefix',
    // strategy: 'prefix_except_default',
    defaultLocale: 'ar',
    defaultDirection: 'rtl',
    detectBrowserLanguage: false, // Disable browser detection
    locales: [
      {
        code: 'ar',
        name: 'العربية',
        file: 'ar.ts',
        dir: 'rtl',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.ts',
        dir: 'ltr',
      },
    ],
    langDir: 'locales',
    experimental: {
      localeDetector: 'localeDetector.ts',
    },
  },
});
