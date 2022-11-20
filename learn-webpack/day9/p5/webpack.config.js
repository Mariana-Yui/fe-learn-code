const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: './index.html',
    title: 'Day7 p2',
  }),
  new VueLoaderPlugin(),
];
isDevelopment && plugins.push(new ReactRefreshWebpackPlugin());

const babelPlugins = [];
isDevelopment && babelPlugins.push('react-refresh/babel');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
    publicPath: '/asset/page/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: babelPlugins,
            },
          },
        ],
      },
      {
        test: /\.vue$/i,
        use: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins,
  resolve: {
    extensions: ['.js', '.json', '.wasm', '.jsx', '.vue'],
    alias: {
      page: path.resolve(__dirname, './page'),
    },
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
};
