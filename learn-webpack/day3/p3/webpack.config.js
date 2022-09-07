const path = require('path');
module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
    // assetModuleFilename: 'img/[name].[hash:6][ext]',
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
          'postcss-loader',
          'sass-loader',
        ],
      },
      // {
      //   test: /\.(gif|jpe?g|png)$/i,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         name: 'img/[name].[hash:6].[ext]',
      //         limit: 3 * 1024 * 1024,
      //         esModule: false,
      //       },
      //     },
      //   ],
      //   type: 'javascript/auto',
      // },
      {
        test: /\.(gif|jpe?g|png)$/i,
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:6][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024 * 1024 // 4kb
          }
        } 
      },
      {
        test: /\.(ttf|eot|woff2?)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:6][ext]',
        }
      }
    ],
  },
};
