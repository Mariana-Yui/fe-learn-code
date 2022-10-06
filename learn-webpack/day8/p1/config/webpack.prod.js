const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  output: {
    publicPath: './',
  },
  plugins: [new CleanWebpackPlugin()],
};
