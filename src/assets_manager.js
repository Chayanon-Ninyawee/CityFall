const AssetsManager = function() {
	this.tile_set_image = undefined;
	this.player_image = undefined;
	this.background_image = undefined;
};

AssetsManager.prototype = {

	constructor: Game.AssetsManager,

	requestJSON:function(url, callback) {
		let request = new XMLHttpRequest();
		request.addEventListener("load", function(event) {

			callback(JSON.parse(this.responseText));

		}, { once:true });

		request.open("GET", url);
		request.send();
	},

	requestImage:function(url, callback) {
		let image = new Image();

		image.addEventListener("load", function(event) {
			callback(image);
		}, { once:true });

		image.src = url;
	},

};