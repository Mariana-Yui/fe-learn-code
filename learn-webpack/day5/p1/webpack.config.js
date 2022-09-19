// webpack模块化解析
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.js',
  // devtool: 'eval', // development默认devtool值
  // devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin({ title: 'Webpack Day5 P1' })],
};
