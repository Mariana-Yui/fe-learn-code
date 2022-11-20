const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './index.js',
    main: './main.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[hash:6].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
  ],
  optimization: {
    runtimeChunk: true
  }
};
