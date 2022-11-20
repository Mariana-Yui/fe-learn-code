const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './index.js',
    main: './main.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].[hash:6].vendor.js',
    path: path.resolve(__dirname, './build'),
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    // chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          filename: '[name].vendor.js',
          priority: -10,
          chunks: 'initial',
        },
        default: {
          filename: '[name].common.js',
          priority: -20,
        },
      },
    },
  },
  performance: {
    hints: false,
  },
};
