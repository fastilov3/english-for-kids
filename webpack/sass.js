module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.sass|scss$/,
          include: paths,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
  }
}
