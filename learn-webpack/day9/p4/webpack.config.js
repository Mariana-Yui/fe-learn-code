const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (env) => {
  const isDevelopment = !env.production;

  return {
    mode: 'production',
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, './build'),
      filename: '[name].[hash:6].bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:6].css'
      }),
    ],
  };
};