/* eslint-disable no-console */
const buildArgs = require('./build-arguments')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')


if (buildArgs.BUILD_USE_LOCAL_STAGING) {
  console.info(`Using staging configuration`)
}

const isProduction = process.env.NODE_ENV === 'production'
const isStaging = process.env.NODE_ENV === 'staging'
const isDevelopment = !isStaging && !isProduction

const resolve = dir => path.join(__dirname, '..', dir)

const publicPath = (env) => {
  switch (env) {
    default:
    case 'development':
      return '/dist/'
    case 'staging':
      return 'https://trackercdn.com/static-files/trackergg/staging/dist/'
    case 'production':
      return 'https://trackercdn.com/static-files/trackergg/production/dist/'
  }
}

const config = {
  devtool: isProduction || isStaging ? 'source-map' : 'eval-cheap-module-source-map',
  mode: isProduction || isStaging ? 'production' : 'development',
  output: {
    path: resolve('dist'),
    publicPath: publicPath(process.env.NODE_ENV),
    filename: 'js/[name].[chunkhash:9].js'
  },
  resolve: {
    modules: [resolve('src'), 'node_modules'],
    extensions: ['.js', '.vue', '.json', '.txt', '.scss'],
    alias: {
      '@': path.resolve(__dirname, '..'),
      '@src': resolve('src'),
      '@public': resolve('public'),
      '@areas': path.resolve(__dirname, '../src/areas'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@config': path.resolve(__dirname, '../src/config'),
      '@views': path.resolve(__dirname, '../src/views'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@stores': path.resolve(__dirname, '../src/stores'),
      '@services': path.resolve(__dirname, '../src/services'),
      '@utilities': path.resolve(__dirname, '../src/utilities')
    }
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ]
      },
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          'vue-loader',
          {
            loader: 'vue-svg-loader',
            options: {
              removeTitle: false
            }
          }
        ],
        exclude: file => /node_modules/.test(file)
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
        options: {
          limit: 256,
          name: 'img/[name].[hash:8].[ext]'
        },
        include: file => /node_modules/.test(file)
      },
      {
        test: /\.(png|jpe?g|gif|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 256,
          name: 'img/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 256,
          name: 'fonts/[name].[hash:8].[ext]',
          esModule: false
        }
      },
      {
        test: /\.(wav|mp3)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 256,
          name: 'audio/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProduction || isStaging ? 'warning' : false
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_USE_LOCAL_STAGING: JSON.stringify(buildArgs.BUILD_USE_LOCAL_STAGING),
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      GIT_COMMIT_HASH: JSON.stringify(
        isProduction || isStaging
          ? process.env.CI_COMMIT_SHA
          : '123'
      )
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:9].css',
      chunkFilename: '[id].[chunkhash:9].css',
      ignoreOrder: true
    }),
    ...(isProduction || isStaging
      ? []
      : [new FriendlyErrorsPlugin()]),
    // new BundleAnalyzerPlugin()
  ]
}

module.exports = config
