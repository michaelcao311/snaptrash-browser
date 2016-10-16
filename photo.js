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
				return items;
    });
};
var type;

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
var custom_dict = {
	"can": "recyclabowl",
	"packaging": "trass",
	"compost": "compostible"
};
(function (){
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

		var conceptsCustom = [];
		var conceptsGeneral = [];
	function takepic() {
		var finished = _.after(2, set_category);
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
			app.models.predict('ab7e8fef3c3343a88ad5841b8a2975ec', {base64: string_data}).then(
			function(response) {
					var some_data = response.data.outputs[0].data.concepts;
					for (i = 0; i < some_data.length; i++) {
						var temp = {'name': some_data[i].name, 'score': some_data[i].value};
						conceptsCustom[i] = temp;
					}
					var make_html = '';
					console.log("CUSTOM");
					console.log(conceptsCustom);
					for (i = 0; i < conceptsCustom.length; i++) {
						make_html += '<li>' + conceptsCustom[i].name + ' ' + conceptsCustom[i].score + ' </li>'
					}
					$("#concepts-custom").html(make_html);
					finished();
		   },
			   function(err) {
			     console.err(err);
			   }
			 );	
			app.models.predict(Clarifai.GENERAL_MODEL, {base64: string_data}).then(
				function(response) {
					var some_data = response.data.outputs[0].data.concepts;
					for (i = 0; i < some_data.length; i++) {
						var temp = {'name': some_data[i].name, 'score': some_data[i].value};
						conceptsGeneral[i] = temp;
					}
					var make_html = '';
					console.log("GENERAL");
					console.log(conceptsGeneral);
					
					for (i = 0; i < conceptsGeneral.length; i++) {
						make_html += '<li>' + conceptsGeneral[i].name + ' ' + conceptsGeneral[i].score + ' </li>'
					}
					$("#concepts-general").html(make_html);
					finished();
			   },
			   function(err) {
			     console.err(err);
			   }
			 );	
		}
	};

	function set_category() {
		type = get_category(conceptsCustom, conceptsGeneral);
		$("#category").text(type);
	};
	function get_category(conceptsCustom, conceptsGeneral) {
		console.log('foop');
		var trashType = "trash";
		for(i = 0; i < conceptsCustom.length; i++) {
			var name = conceptsCustom[i].name;

			var score = conceptsCustom[i].score;
			if((name in custom_dict) && score > 0.37) {
				console.log(name);
				console.log("we fade it");
				console.log(custom_dict[name]);
				return custom_dict[name];
			}
		}
		for(i = 0; i < conceptsGeneral.length; i++) {
			var name = conceptsGeneral[i].name;
			var score = conceptsGeneral[i].score;
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
