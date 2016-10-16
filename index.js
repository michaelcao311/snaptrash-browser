var clientId = 'VMsW98gyAwRP0sQRU8ZP42X07i-m_f0rbjTiyzVj';
var clientSecret = 'WjgjycdmOoDW4C_IzL6PCB0Ukn6y0jtVov-xR6CY';

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