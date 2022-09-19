const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/i,
  //       exclude: /node_modules/,
  //       use: {
  //         loader: 'babel-loader',
  //         // options: {
  //         //   // plugins: ['@babel/plugin-transform-arrow-functions', '@babel/plugin-transform-block-scoping'],
  //         //   presets: [
  //         //     ['@babel/preset-env', {
  //         //       // targets: ["chrome 88"],
  //         //       // enmodules: true,
  //         //     }]
  //         //   ]
  //         // },
  //       },
  //     },
  //   ],
  // },
};
