import { defineNuxtPlugin } from '#app'
import { PiniaColada } from '@pinia/colada'
import { createColadaAdapter } from './contracts/colada-adapter'
import { createApiClient } from './utils/api-client'
import { createPinia } from 'pinia'

export default defineNuxtPlugin({
  name: 'api-layer',
  parallel: false,
  setup(nuxtApp) {
    // 1. Install generic Colada plugin
    const pinia = createPinia()
    nuxtApp.vueApp.use(pinia)
    nuxtApp.vueApp.use(PiniaColada)

    // 2. Register our specific adapter object
    const adapter = createColadaAdapter()
    nuxtApp.provide('apiAdapter', adapter)

    // Initialize the fetcher
    const api = createApiClient()
    nuxtApp.provide('api', api)
  },
})
