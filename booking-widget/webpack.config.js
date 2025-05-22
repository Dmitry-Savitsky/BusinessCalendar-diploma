const path = require('path');

module.exports = {
  mode: 'development',
  entry: './components/booking-widget/index.tsx',
  output: {
    filename: 'booking-widget.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:3001/',
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
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
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
    port: 3001,
    host: 'localhost',
    hot: true,
    allowedHosts: 'all',
    devMiddleware: {
      publicPath: 'http://localhost:3001/',
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