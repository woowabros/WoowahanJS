var webpack = require('webpack');
var entry = './main.js';
var output = {
  path: __dirname,
  filename: 'bundle.js'
};

module.exports = {
  debug : true,
  devtool: 'cheap-module-eval-source-map',
  entry: entry,
  output: output,
  module : {
    loaders : [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};
