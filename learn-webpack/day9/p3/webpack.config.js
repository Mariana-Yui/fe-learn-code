const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[hash:6].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new ProvidePlugin({
      _: 'lodash',
      moment: 'moment',
      _map: ['lodash', 'map'],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
