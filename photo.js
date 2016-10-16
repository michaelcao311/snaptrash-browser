var items_file = '/items.csv';
function parse_data() {
	var items = [];
	$.get(items_file, function(data) {
        var lines = data.split('\n');
				for (i = 0; i < lines.length; i++) {
					var elements = lines[i].split(',');
					var storage = [elements[0], elements[1], elements[2]];
					items[i] = storage;
				}
				console.log(items);
				return items;
    });
};

var item_dict = {
	"food paper": "compostable",
	"drink": "recyclable",
  "yard": "compostable",
	"food": "compostable",
	"paper": "recyclable",
	"metal": "recyclable",
	"glass": "recyclable",
	"plastic": "recyclable",

};
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
		$("#pic-container").fadeOut();
    $("#pic-container").fadeIn();
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
					console.log(response);
					var some_data = response.data.outputs[0].data.concepts;
					for (i = 0; i < some_data.length; i++) {
						var temp = {'name': some_data[i].name, 'score': some_data[i].value};
						concepts[i] = temp;
					}
					var make_html = '';
					var type = get_category(concepts);
					console.log("TYPE");
					console.log(type);
					$("#category").text(get_category(concepts));
					for (i = 0; i < concepts.length; i++) {
						make_html += '<li>' + concepts[i].name + ' ' + concepts[i].score + ' </li>'
					}
					$("#concepts").html(make_html);

					parse_data();
		   },
			   function(err) {
			     console.err(err);
			   }
			 );	
		}
	return concepts;	
	};

	function get_category(concepts) {
		var trashType = "trash";
		for(i = 0; i < concepts.length; i++) {
			var name = concepts[i].name;
			var score = concepts[i].score;
			if((name in item_dict) && score > 0.9) {
				console.log(name);
				console.log("WE MADE it");
				console.log(item_dict[name]);
				return item_dict[name];
			}
		}
		return trashType;
	};
	window.addEventListener('load', startup, false);
})();
