import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.config.errorHandler = (err, vm) => {
  let isDevelopment = process.env.NODE_ENV === 'development'
  let isProduction = process.env.NODE_ENV === 'production'
  if (isDevelopment) {
    throw err
  }
}

Vue.config.errorHandler = (err, vm, trace) => {
  let isDevelopment = process.env.NODE_ENV === 'development'
  if (isDevelopment) {
    console.warn(err)
  }
}

Vue.use(PiniaVuePlugin)

import App from './App.vue'

Vue.config.productionTip = false

export async function createApp(ssrContext) {

  const pinia = createPinia()

  const app = new Vue({
    pinia,
    ssrContext,
    render: h => h(App)
  })

  return { app, pinia }
}
