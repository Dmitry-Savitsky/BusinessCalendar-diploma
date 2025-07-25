const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

// Загружаем ts-node для поддержки TypeScript
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
  },
});

const { config } = require('./lib/config');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './components/booking-widget/index.tsx',
  output: {
    filename: 'booking-widget.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: config.widgetPublicPath,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'booking-widget.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
    ],
  },
};