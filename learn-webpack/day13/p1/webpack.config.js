const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname),
  entry: './src/main.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.[hash:8].js',
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/i,
      //   use: 'yui-loader01',
      // },
      // {
      //   test: /\.js$/i,
      //   use: 'yui-loader02',
      //   enforce: 'pre',
      // },
      // {
      //   test: /\.js$/i,
      //   use: 'yui-loader03',
      // },
      {
        test: /\.js$/i,
        use: {
          loader: 'yui-babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.md$/i,
        use: {
          loader: 'yui-md-loader',
          options: {
            firstName: 'Mariana',
            lastName: 'Yui',
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolveLoader: {
    modules: ['node_modules', './yui-loaders'],
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()],
};
