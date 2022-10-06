const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { resolveDir } = require('./path');
const webpackDevConfig = require('./webpack.dev');
const webpackProdConfig = require('./webpack.prod');
const { merge } = require('webpack-merge');

module.exports = function (env) {
  process.env.NODE_ENV = env.production ? 'production' : 'development';
  const isProduction = env.production;
  console.log(env);

  const commonConfig = {
    entry: './index.js',
    output: {
      filename: 'bundle.js',
      path: resolveDir('./build'),
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.vue$/i,
          use: 'vue-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Day7 p2',
      }),
      new VueLoaderPlugin(),
    ],
    resolve: {
      extensions: ['.js', '.json', '.wasm', '.jsx', '.vue'],
      alias: {
        page: resolveDir('./page'),
      },
    },
  };

  const config = isProduction ? webpackProdConfig : webpackDevConfig;

  return merge(commonConfig, config);
};
