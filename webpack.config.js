const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },

  devServer: {
    contentBase: path.join(__dirname, ''),
    compress: true,
    port: 9000,
    stats:"errors-only",
    open: true
  }

};