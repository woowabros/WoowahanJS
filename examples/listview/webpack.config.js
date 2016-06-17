var webpack = require('webpack');
var entry = './main.js';
var output = {
  path: __dirname,
  filename: 'bundle.js'
};

var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  compressor: {
    screw_ie8: true,
    warnings: false
  },
  output: {
    comments: false
  }
});

module.exports.development = {
  debug : true,
  devtool: 'cheap-module-eval-source-map',
  entry: entry,
  output: output,
  module : {
    loaders : [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, exclude: /node_modules/, loader: 'css-loader' },
      { test: /\.hbs$/, exclude: /node_modules/, loader: 'handlebars-loader'}
    ]
  }
};

module.exports.production = {
  debug: false,
  entry: entry,
  output: output,
  module : {
    loaders : [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, exclude: /node_modules/, loader: 'css-loader' },
      { test: /\.hbs$/, exclude: /node_modules/, loader: 'handlebars-loader'}
    ]
  },
  plugins: [ uglifyJsPlugin ]
};
