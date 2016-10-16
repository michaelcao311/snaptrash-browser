var Clarifai = require('clarifai');
var keys = require('./keys.js');

var app = new Clarifai.App(
  keys.clientId,
  keys.clientSecret
);

app.models.predict(Clarifai.GENERAL_MODEL, {base64: "G7p3m95uAl..."}).then(
  function(response) {
    // do something with response
  },
  function(err) {
    // there was an error
  }
);