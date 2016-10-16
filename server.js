var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('trash');
});

app.listen(1111, function () {
  console.log('blob');
});