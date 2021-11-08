module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.mp3$/,
          loader: 'file-loader',
          options: {
            name: 'sounds/[name].[ext]',
          },
        },
      ],
    },
  };
};
