const path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PrettyPrintPlugin = require('@lofty/lofty-pretty-print-plugin');
const CommonConfig = require('./webpack.common.js');

const config = Merge(CommonConfig, {
  entry: {
    "main": [
      'webpack-dev-server/client?http://localhost:' + process.env.PORT,
      'whatwg-fetch',
      'webpack/hot/only-dev-server',
      path.resolve('./src/index')
    ],
  },

  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        include: path.resolve('./src'),
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
          { loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                require('autoprefixer')({browsers: ['last 2 versions']}),
              ],
            },
          },
        ],
      },
    ],
  },

  output: {
    publicPath: path.resolve('/static/'),
    filename: '[name].dev.js',
    path: path.resolve('./dev'),
  },

  devtool: 'eval',

  externals: {
    'react/addons': 'true',
    'react/lib/ExecutionEnvironment': 'true',
    'react/lib/ReactContext': 'true',
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: path.resolve('static'), to: path.resolve('./') },
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new PrettyPrintPlugin(),
  ],
});

module.exports = config;
