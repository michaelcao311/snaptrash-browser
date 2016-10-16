(function() {
	var width = 320;
	var height = 0;

	console.log("hi");

	var streaming = false;
	var video = null;
	var canvas = null;
	var photo = null;
	var eyy = null;
	function startup() {
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		photo = document.getElementById('photo');
		eyy = document.getElementById('eyy');
		navigator.getMedia = (navigator.getUserMedia ||	
														navigator.webkitGetUserMedia ||
														navigator.mozGetUserMedia ||
														navigator.msGetUserMedia);
		navigator.getMedia(
			{
				video: true,
				audio: false
			},
			function(stream) {
				// firefox
				if (navigator.mozGetUserMedia) {
					video.mozSrcObject = stream;
				} else {
					console.log('not firefox');
					var vendorURL = window.URL || window.webkitURL;
					video.src = vendorURL.createObjectURL(stream);
				}
				video.play();

			},
			function(err) {
				console.log("EYYYYY! " + err);
			});
		video.addEventListener('canplay', function(exp) {
			$('#eyyyy').fadeIn();
			if(!streaming) {
				height = video.videoHeight / (video.videoWidth/width);
				if (isNaN(height)) {
					height = width / (4/3);
				}
				video.setAttribute('width', width);
				video.setAttribute('height', height);
				canvas.setAttribute('width', width);
				canvas.setAttribute('height', height);
				// now that we set the coordinates, we can just streammmm
				streaming = true;
			}
		}, false);
		eyy.addEventListener('click', function(exp) {
			takepic();
			exp.preventDefault();
		}, false);
	}

	function takepic() {
		var context = canvas.getContext('2d');
		$("#poutput").fadeOut();
    $("#poutput").fadeIn();
	  if (width && height) {
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video, 0, 0, width, height);
			// HERES THE BASE 64 DATA
			var data = canvas.toDataURL('image/png');
			photo.setAttribute('src', data);
			var string_data = data.toString('base64');
			// app.models.predict(Clarifai.GENERAL_MODEL, {base64: data}).then(
			//   function(response) {
			//     console.log(response);
			//   },
			//   function(err) {
			//     console.err(err);
			//   }
			// );	
			app.models.predict(Clarifai.GENERAL_MODEL, "https://samples.clarifai.com/metro-north.jpg").then(
			  function(response) {
			    console.log(response);
			  },
			  function(err) {
			    // there was an error
			  }
			);
		}	
	};
	window.addEventListener('load', startup, false);
})();
