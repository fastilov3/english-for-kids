module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(jpg)|(jpeg)|(png)$/,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        },
      ],
    },
  };
};
