var clientId = 'BZ8FbcALIw8rIup0pJVbflD3E8jpxPML344krhh4';
var clientSecret = 'PqJozs2-fcxMC0Le0Xe6K677OOVozx9CDqWeyQqP';

var app = new Clarifai.App(
  clientId,
  clientSecret
);

app.models.predict(Clarifai.GENERAL_MODEL, "https://samples.clarifai.com/metro-north.jpg").then(
  function(response) {
    console.log(response);
  },
  function(err) {
    // there was an error
  }
);
