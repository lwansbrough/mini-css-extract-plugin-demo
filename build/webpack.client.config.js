const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CssMinimizerPlugin  = require('css-minimizer-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const hash = require('string-hash')

const isProduction = process.env.NODE_ENV === 'production'
const isStaging = process.env.NODE_ENV === 'staging'
const isDevelopment = !isStaging && !isProduction

const config = merge(baseConfig, {
  entry: {
    app: './src/entry-client.js'
  },
  optimization: {
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',
    minimize: isStaging || isProduction,
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        terserOptions: {
          sourceMap: true
        }
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        }
      })
    ],
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /\/node_modules\/.*(?<!\.css)$/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `vendor.${hash(packageName)}`
          }
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"',
    }),
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    new VueSSRClientPlugin()
  ]
})
module.exports = config
