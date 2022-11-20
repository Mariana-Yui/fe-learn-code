const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'math',
    globalObject: 'this',
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ]
}