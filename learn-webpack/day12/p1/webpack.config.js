const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NonstandardWebpackPlugin = require('nonstandard-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.[fullhash:8].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './_template.html'),
      specific: 'window.NONOTNEEDLOGIN=false;window.PROMNOSTARNDAPRE=false;',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
      },
    }),
    new NonstandardWebpackPlugin({
      replace: [
        {
          from: /<script id="?nonstandard"?>(.*)<\/script>/,
          to: '<script>window.NOTNEEDLOGIN=true;window.PROMNOSTARNDAPRE=true;</script>',
        },
      ],
      filename: 'apre_index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
      },
      zip: true,
    }),
  ],
};
