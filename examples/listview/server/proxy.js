var format = require('util').format;
var express = require('express');
var morgan = require('morgan');
var request = require('request');
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var app = express();

const realHost = 'http://api-server.com';
const port = process.env.PORT || 4000;
const mock = JSON.parse(process.env.MOCK || false);

function saveCached(url, body) {
  var cachePath = path.resolve(__dirname, '.cache');
  var cacheFile = md5(url);

  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  fs.writeFile(path.resolve(cachePath, format('%s.json', cacheFile)), body);
}

function getCached(url) {
  var cachePath = path.resolve(__dirname, '.cache');
  var cacheFile = md5(url);

  if (fs.existsSync(path.resolve(cachePath, cacheFile+'.json'))) {
    return require('./.cache/'+cacheFile+'.json');
  }
  return {};
}

app.use(morgan('dev'));
app.use(express.static('dist'));

app.get('*', (req, res) => {
  if (mock) {
    res.json(getCached(req.url));
  } else {
    request(format('%s%s', realHost, req.url), (err, response, body) => {
  saveCached(req.url, body);
}).pipe(res);
}
});

app.listen(port, () => {
  console.log('ready %s (mock:%s)', port, mock);
});
