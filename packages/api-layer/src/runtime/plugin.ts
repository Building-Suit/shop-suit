import { defineNuxtPlugin } from "#app";
import { PiniaColada } from "@pinia/colada";
import { createColadaAdapter } from "./contracts/colada-adapter";
import { createApiClient } from "./utils/api-client";

export default defineNuxtPlugin((nuxtApp) => {
  // 1. Install generic Colada plugin
  nuxtApp.vueApp.use(PiniaColada);

  // 2. Register our specific adapter object
  const adapter = createColadaAdapter();
  nuxtApp.provide("apiAdapter", adapter);

  // Initialize the fetcher
  const api = createApiClient();
  nuxtApp.provide("api", api);
});
