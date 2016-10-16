var express = require('express');
var app = express();
var util = require('util');
var path = require('path');
var keys = require('./keys');
var request = require('request');
var http = require('http');
var fs = require('fs');
var bodyparser = require('body-parser');
var querystring = require('query-string');

var postData = querystring.stringify({
  'grant_type': 'client_credentials',
  'client_id': keys.clientId,
  'client_secret': keys.clientSecret
});

var options = {
  hostname: 'https://api.clarifai.com',
  port: 80,
  path: '/v1/token/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

var req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();

app.use(bodyparser.json());
app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/pic', function(req, res) {
  var stuff = req.body.image_data;
  console.log(image_data);
});


app.listen(1111, function () {
  console.log('blob');
});
