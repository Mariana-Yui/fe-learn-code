const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { resolveDir } = require("./path");

module.exports = {
  mode: 'development',
  output: {
    publicPath: '/asset/page/',
  },
  plugins: [
    new ReactRefreshPlugin()
  ],
  devServer: {
    hot: 'only',
    devMiddleware: {
      publicPath: '/asset/page/',
    },
    static: {
      directory: resolveDir('./yui'),
      watch: true,
    },
    compress: true,
    historyApiFallback: {
      rewrites: [{ from: /about|me/, to: '/asset/page/' }],
    },
    /** 注释查看跨域问题 */
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        pathRewrite: {
          '^/api': '',
        },
        secure: false,
        changeOrigin: true,
      },
    },
    /** 注释查看跨域问题 */
  },
};
