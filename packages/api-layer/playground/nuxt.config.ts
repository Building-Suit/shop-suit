export default defineNuxtConfig({
  modules: ["@buildingsuit/api-layer"],
  devtools: { enabled: true },
  compatibilityDate: "latest",
  apiLayer: {
    portalKey: "test",
    apiBaseUrl: "/api",
  },
});
