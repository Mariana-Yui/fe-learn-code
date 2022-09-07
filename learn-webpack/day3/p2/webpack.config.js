const path = require('path');
module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
  },
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     postcssOptions: {
          //       // plugins: ['autoprefixer']
          //       plugins: [require('postcss-preset-env')],
          //     },
          //   },
          // },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
