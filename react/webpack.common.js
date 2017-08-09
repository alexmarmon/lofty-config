const path = require('path');
const webpack = require('webpack');

const config = {
  context: path.resolve('./'),

  performance: {
    hints: process.env.npm_lifecycle_event === 'build' ? "warning" : false
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(jsx?|js)$/,
        use: ['react-hot-loader/webpack', 'babel-loader'],
        include: path.resolve('./src'),
      },
      {
        test: /\.(jsx?|js)$/,
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
  }
};

module.exports = config;
