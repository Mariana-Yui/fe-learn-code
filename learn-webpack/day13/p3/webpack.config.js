const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoUploadWebpackPlugin = require('./plugins/AutoUploadPlugin');
const path = require('path');
const { CleanPlugin } = require('webpack');

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  plugins: [
    new CleanPlugin(),
    // new HtmlWebpackPlugin(),
    new AutoUploadWebpackPlugin({
      host: '9.135.8.155',
      port: '36000',
      username: 'root',
      password: '',
      remotePath: '/root/denislin',
    }),
  ],
};
