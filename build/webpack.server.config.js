const baseConfig = require('./webpack.base.config.js')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const isStaging = process.env.NODE_ENV === 'staging'
const isDevelopment = !isStaging && !isProduction

module.exports = merge(baseConfig, {
  // This allows webpack to handle dynamic imports in a Node-appropriate
  // fashion, and also tells `vue-loader` to emit server-oriented code when
  // compiling Vue components.
  target: 'node',

  // For bundle renderer source map support
  devtool: 'source-map',

  // Point entry to your app's server entry file
  entry: './src/entry-server.js',

  // This tells the server bundle to use Node-style exports
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },

  // // https://webpack.js.org/configuration/externals/#function
  // // https://github.com/liady/webpack-node-externals
  // // Externalize app dependencies. This makes the server build much faster
  // // and generates a smaller bundle file.
  externals: [nodeExternals({
    // do not externalize dependencies that need to be processed by webpack.
    // you can add more file types here e.g. raw *.vue files
    // you should also whitelist deps that modifies `global` (e.g. polyfills)
    allowlist: [/\.css$/, /\?vue&type=style/]
  })],

  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"server"'
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    // This is the plugin that turns the entire output of the server build
    // into a single JSON file. The default file name will be
    // `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin()
  ]
})
