import Vue from 'vue'
import {
  createApp
} from './app'

// Get the applications locale from the document lang tag so that we can
// use it to initialize the application later on, defaulting to english.
let locale = 'en'
if (document.documentElement.lang) {
  locale = document.documentElement.lang
}

createApp({
  isSSR: false,
  locale,
  domain: window.location.hostname,
  url: window.location.href
}).then(({
  app,
  router,
  pinia
}) => {
  if (window.__INITIAL_STATE__) {
    // If SSR injected the initial state, we get it
    // and replace the stores current state.
    pinia.state.value = window.__INITIAL_STATE__
  }

  router.onReady(async () => {
    app.$mount('#app')
  })
})
