const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    publicPath: './',
    path: path.resolve(__dirname, './build'),
    filename: '[name].[hash:6].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime.*\.js/]),
  ],
  optimization: {
    runtimeChunk: true,
  }
}