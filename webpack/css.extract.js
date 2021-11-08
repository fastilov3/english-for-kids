const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.sass|scss$/,
          include: paths,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
    ],
  };
};
