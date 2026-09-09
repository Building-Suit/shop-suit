import { useNuxtApp } from "#app";
import type { $Fetch } from "ofetch";

export const useApiClient = (): $Fetch => {
  const nuxt = useNuxtApp();

  return nuxt.$api as $Fetch;
};
