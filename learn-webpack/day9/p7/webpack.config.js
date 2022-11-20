const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: './index.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    // scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
}