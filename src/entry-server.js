import {
  createApp
} from './app'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  // since there could potentially be asynchronous route hooks or components,
  // we will be returning a Promise so that the server can wait until
  // everything is ready before rendering.
  return new Promise((resolve, reject) => {
    createApp({
      isSSR: true,
      locale: context.locale,
      domain: context.hostname,
      url: context.fullUrl
    }).then(({
      app
    }) => {
      resolve(app)
    }, reject)
  })
}
