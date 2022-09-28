const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const config = require('./webpack.config');

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));

app.listen(8080, () => {
  console.log('server is running on port 8080');
});
