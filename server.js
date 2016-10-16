var express = require('express');
var app = express();
var util = require('util');
var path = require('path');
var keys = require('./keys');
var request = require('co-request');
var http = require('http');
var fs = require('fs');
var bodyparser = require('body-parser');
var querystring = require('query-string');

function *postToClarifai() {

  var payload = {
    client_id: keys.clientId,
    client_secret: keys.clientSecret,
    grant_type: client_credentials
  }

  var result = yield* request(
    uri: 'https://api.clarifai.com/v1/token/',
    method: 'POST',
    form: payload
  );

  var response = result.body;
  var parsedResponse = JSON.parse(response);
  console.log(parsedResponse);

}

postToClarifai();

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
