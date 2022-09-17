const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CssMinimizerPlugin  = require('css-minimizer-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const hash = require('string-hash')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          isStaging || isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"',
    }),
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    new VueSSRClientPlugin(),
    ...(isProduction || isStaging
      ? [
        new MiniCssExtractPlugin({
          filename: '[name].[chunkhash:9].css',
          chunkFilename: '[id].[chunkhash:9].css',
          ignoreOrder: true
        }),
      ]
      : [])
  ]
})
module.exports = config
