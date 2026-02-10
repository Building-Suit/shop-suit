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
    '@buildingsuit/api-layer',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxtjs/i18n',
  ],

  apiLayer: {
    portalKey: 'shop-crm',
    // This is the URL of your BFF (Backend For Frontend)
    // In production, this might be a subdomain like https://api.yourdomain.com
    // In development, we use the same host as Nuxt but with a different port (e.g. 3001)
    apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
  },

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
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
    strategy: 'no_prefix',
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
