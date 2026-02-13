import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImportsDir,
  addServerImportsDir,
  hasNuxtModule,
  installModule,
} from "@nuxt/kit";
import type { ApiLayerConfig } from "./runtime/composables/useApiConfig";

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    apiLayer: ApiLayerConfig;
  }
}

export default defineNuxtModule<ApiLayerConfig>({
  meta: {
    name: "@buildingsuit/api-layer",
    configKey: "apiLayer",
  },
  defaults: {
    portalKey: "",
    apiBaseUrl: "/api",
    billing: {
      plans: "/billing/plans",
      checkout: "/billing/checkout",
      subscription: "/billing/subscription",
      webhooks: "/billing/webhooks",
    },
    authRoutes: {
      signup: "/auth/signup",
      login: "/auth/login",
      session: "/auth/session",
      logout: "/auth/logout",
      resetPassword: "/auth/reset-password",
      oauthGoogle: "/auth/oauth/google",
    },
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // if (!options.portalKey) {
    //   throw new Error("[api-layer] portalKey is required in module options");
    // }

    nuxt.options.runtimeConfig.public.apiLayer = {
      portalKey: options.portalKey,
      apiBaseUrl: options.apiBaseUrl,
      authRoutes: options.authRoutes,
    };

    // Client-side auto-imports
    addImportsDir(resolver.resolve("./runtime/composables"));
    addImportsDir(resolver.resolve("./runtime/contracts"));
    addImportsDir(resolver.resolve("./runtime/factory"));

    // Server-side auto-imports
    addServerImportsDir(resolver.resolve("./runtime/server/utils"));

    addPlugin(resolver.resolve("./runtime/plugin"));
  },
});
