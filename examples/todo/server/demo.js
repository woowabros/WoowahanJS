var path = require('path');
var express = require('express');
var morgan = require('morgan');
var app = express();

const port = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(express.static('dist'));

app.listen(port, () => {
  console.log('ready %s', port);
});
