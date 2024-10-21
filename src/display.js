const Display = function(scale) {

	this.buffer  = document.createElement("canvas").getContext("2d"),
	this.ctx = document.getElementById('canvas').getContext('2d');

	this.scale = scale;
	this.reScale = this.scale;

	this.drawMap = function(image, image_columns, map, map_columns, tile_size, canvas_width, canvas_height) {
		for (let index = map.length - 1; index > -1; --index) {
			// check if the tile is in the screen
			if ((index % map_columns)*tile_size*this.reScale < this.x - tile_size*this.reScale || (index % map_columns)*tile_size*this.reScale > this.x + canvas_width || (Math.floor(index/map_columns)*tile_size*this.reScale < this.y - tile_size*this.reScale || Math.floor(index/map_columns)*tile_size*this.reScale > this.y + canvas_height)) continue;
			let value = map[index] - 1;
			let source_x      =           (value % image_columns) * tile_size;
			let source_y      = Math.floor(value / image_columns) * tile_size;
			let destination_x =           (index % map_columns  ) * tile_size;
			let destination_y = Math.floor(index / map_columns  ) * tile_size;

			this.buffer.drawImage(
				image,
				source_x, source_y,
				tile_size, tile_size,
				destination_x, destination_y,
				tile_size, tile_size);
		}
	};

	this.drawObject = function(image, source_x, source_y, destination_x, destination_y, width, height) {
		this.buffer.drawImage(
			image,
			source_x, source_y,
			width, height,
			Math.round(destination_x), Math.round(destination_y),
			width, height);
	};

	this.resize = function(width, height) {
		this.ctx.canvas.width = width;
		this.ctx.canvas.height = height;

		// Make canvas center
		this.ctx.canvas.style.marginLeft = (window.innerWidth - width) / 2 + "px";
		this.ctx.canvas.style.marginTop = (window.innerHeight - height) / 2 + "px";

		if ((this.ctx.canvas.width / this.buffer.canvas.width) > (this.ctx.canvas.height / this.buffer.canvas.height)) {
			if (this.ctx.canvas.width > this.buffer.canvas.width * this.scale) {
				this.reScale = this.ctx.canvas.width / this.buffer.canvas.width;
			} else {
				this.reScale = this.scale;
			}
		} else {
			if (this.ctx.canvas.height > this.buffer.canvas.height * this.scale) {
				this.reScale = this.ctx.canvas.height / this.buffer.canvas.height;
			} else {
				this.reScale = this.scale;
			}
		}
		
		this.ctx.imageSmoothingEnabled = false;
	};

	this.changeScale = function(scale) {
		this.scale = scale;
		this.reScale = this.scale;
	}


	this.camera = function(x, y) {
		if ((x * this.reScale) < (this.ctx.canvas.width / 2)) {
			this.x = 0;
		} else if ((x * this.reScale) > (this.buffer.canvas.width * this.reScale) - (this.ctx.canvas.width / 2)) {
			this.x = (this.buffer.canvas.width * this.reScale) - this.ctx.canvas.width;
		} else {
			this.x = (x * this.reScale) - (this.ctx.canvas.width / 2);
		}
		
		if ((y * this.reScale) < (this.ctx.canvas.height / 2)) {
			this.y = 0;
		} else if ((y * this.reScale) > (this.buffer.canvas.height * this.reScale) - (this.ctx.canvas.height / 2)) {
			this.y = (this.buffer.canvas.height * this.reScale) - this.ctx.canvas.height;
		} else {
			this.y = (y * this.reScale) - (this.ctx.canvas.height / 2);
		}
	}
};

Display.prototype = {
	constructor : Display,

	render:function() {
		this.ctx.drawImage(
			this.buffer.canvas,
			0, 0,
			this.buffer.canvas.width, this.buffer.canvas.height,
			-this.x, -this.y,
			Math.ceil(this.buffer.canvas.width * this.reScale), Math.ceil(this.buffer.canvas.height * this.reScale));
		this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
	},
};