const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require("webpack");

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    // minimizer: [
    //   new TerserPlugin({
    //     extractComments: false,
    //     terserOptions: {
    //       compress: {
    //         keep_fnames: true
    //       }
    //     }
    //   }),
    // ],
  },
}