const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Загружаем ts-node для поддержки TypeScript
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
  },
});

const { config } = require('./lib/config');

module.exports = {
  mode: 'development',
  entry: './components/booking-widget/index.tsx',
  output: {
    filename: 'booking-widget.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: config.widgetPublicPath,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.widget.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            test: /\.module\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]',
                    exportLocalsConvention: 'camelCase',
                  },
                  importLoaders: 1,
                },
              },
              'postcss-loader',
            ],
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: false,
                  importLoaders: 1,
                },
              },
              'postcss-loader',
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'booking-widget.css',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
    'react-dom/client': 'window.ReactDOM',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    port: config.widgetPort,
    host: 'localhost',
    hot: true,
    allowedHosts: 'all',
    devMiddleware: {
      publicPath: config.widgetPublicPath,
      writeToDisk: true,
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/', (_, response) => {
        response.send('webpack-dev-server');
      });

      return middlewares;
    },
  },
}; 