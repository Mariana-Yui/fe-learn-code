const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { CleanPlugin } = require("webpack");

module.exports = {
  entry: './index.js',
  context: __dirname,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
  },
  plugins: [
    new CleanPlugin(),
    new HtmlWebpackPlugin(),
  ]
}