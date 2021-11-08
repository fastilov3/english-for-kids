const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

const devserver = require('./webpack/devserver');
const babel = require('./webpack/babel');
const eslint = require('./webpack/eslint');
const css = require('./webpack/css');
const extractCss = require('./webpack/css.extract');
const sass = require('./webpack/sass');
const html = require('./webpack/html');
const image = require('./webpack/image');
const svg = require('./webpack/svg');
const sounds = require('./webpack/sounds');

const PATHS = {
  // eslint-disable-next-line no-undef
  src: path.join(__dirname, 'src'),
  // eslint-disable-next-line no-undef
  build: path.join(__dirname, ''),
};

const common = merge([
  {
    entry: {
      main: PATHS.src + '/app.js',
    },
    output: {
      path: PATHS.build,
      filename: 'js/[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['main'],
        template: PATHS.src + '/index.html',
      }),
    ],
  },
  html(),
  image(),
  svg(),
  sounds(),
]);

module.exports = function (env) {
  if (env === 'production') {
    return merge([common, extractCss(), babel()]);
  }
  if (env === 'development') {
    return merge([common, devserver(), sass(), css(), babel(), eslint()]);
  }
};
