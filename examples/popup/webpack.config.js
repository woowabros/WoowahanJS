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
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.hbs$/, exclude: /node_modules/, loader: 'handlebars-loader' },
      { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] },
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports-loader?jQuery=jquery' },
      { test: /\.(eot|svg|ttf|woff|woff2)$/,loader: 'file?name=public/fonts/[name].[ext]' }
    ]
  }
};
