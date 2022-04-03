module.exports = {
  mode: 'production',
  entry: './src/Adhan.js',
  output: {
    path: `${__dirname}`,
    filename: 'Adhan.js',
    library: 'adhan',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
