var path = require('path');
var express = require('express');
var morgan = require('morgan');
var app = express();
var users = require(path.resolve(__dirname, 'data/users.json'));

const port = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(express.static('dist'));

app.get('/users', (req, res) => {
  var page = req.query.p || 1;
  var limit = req.query.l || 15;
  var resultSet = [];

  for(var i=0; i<limit; i++) {
    resultSet.push(users[i]);
  }

  res.json(resultSet);
});
app.get('/users/:id', (req, res) => res.json(users.find(user => user.id == +req.params.id)));

app.listen(port, () => {
  console.log('ready %s', port);
});
