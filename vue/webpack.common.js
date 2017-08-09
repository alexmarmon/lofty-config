const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  context: path.resolve('./'),

  performance: {
    hints: process.env.npm_lifecycle_event === 'build' ? "warning" : false
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          postcss: [
            require('autoprefixer')(),
          ],
          loaders: {
            js: 'babel-loader!eslint-loader',
            scss: ExtractTextPlugin.extract({
              use: [
                'css-loader',
                'sass-loader',
              ],
              fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
            }),
          },
        },
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.resolve('./src'),
      },
      {
        test: /\.(vue|js)$/,
        exclude: /node_modules/,
        include: path.resolve('./src'),
        use: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader?name=fonts/[name].[ext]',
        include: path.resolve('./src'),
      }
    ],
  },

  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
  },

  plugins: [
    new ExtractTextPlugin("main.css"),
  ],
};

module.exports = config;
