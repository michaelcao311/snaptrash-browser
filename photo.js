(function() {
	var width = 320;
	var height = 0;

	console.log("hi");

	var streaming = false;
	var video = null;
	var canvas = null;
	var photo = null;
	var snapButton = null;
	function startup() {
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		photo = document.getElementById('photo');
		snapButton = document.getElementById('snap-button');
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
			$('#video-container').fadeIn();
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
		snapButton.addEventListener('click', function(exp) {
			var result = takepic();
			exp.preventDefault();
		}, false);
	}

	function takepic() {
		var concepts = [];
		var context = canvas.getContext('2d');
		$("#pic-output").fadeOut();
    $("#pic-output").fadeIn();
	  if (width && height) {
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video, 0, 0, width, height);
			// HERES THE BASE 64 DATA
			var data = canvas.toDataURL('image/png');
			photo.setAttribute('src', data);
			var string_data = data.toString('base64');
			string_data = string_data.substring(22);
			app.models.predict(Clarifai.GENERAL_MODEL, {base64: string_data}).then(
			function(response) {
					var some_data = response.data.outputs[0].data.concepts;
					for (i = 0; i < some_data.length; i++) {
						var temp = {'name': some_data[i].name, 'score': some_data[i].value};
						concepts[i] = temp;
					}
					console.log(concepts);
		   },
			   function(err) {
			     console.err(err);
			   }
			 );	
		}
	return concepts;	
	};
	window.addEventListener('load', startup, false);
})();
