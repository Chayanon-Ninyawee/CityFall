window.addEventListener('load', function() {
	var render = function() {
		display.camera(game.world.player.x, game.world.player.y);
		display.ctx.clearRect(0, 0, display.ctx.canvas.width, display.ctx.canvas.height);

		var w = undefined;
		var h = undefined;
		if (display.ctx.canvas.width < display.ctx.canvas.height * (1920/1080)) {
			w = display.ctx.canvas.height * (1920/1080);
			h = display.ctx.canvas.height;
		} else {
			w = display.ctx.canvas.width;
			h = display.ctx.canvas.width * (1080/1920);
		}

		display.ctx.drawImage(assets_manager.background_image,
			0, 0,
			1920, 1080,
			0, 0,
			w, h);

		display.drawMap(assets_manager.tile_set_image, game.world.tile_set.columns, game.world.data, game.world.columns, game.world.tile_set.tile_size, display.ctx.canvas.width, display.ctx.canvas.height);

		var frame = game.world.tile_set.frames[game.world.player.frame_value];

		display.drawObject(assets_manager.player_image,
			frame.x, frame.y,
			game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
			game.world.player.y + frame.offset_y, frame.width, frame.height);

		display.render();
	};

	var update = function() {
		if (controller.left.active)  { game.world.player.moveLeft();  }
		if (controller.right.active) { game.world.player.moveRight(); }
		if (!(controller.left.active
			|| controller.right.active)) { game.world.player.moveNone(); }
		if (controller.up.active)    { game.world.player.jump(); controller.up.active = false; }
		if (game.world.player.x >= game.world.width) { menu.finish(); game.world.player.respawn(); }
		game.update();
	};

	var resize = function() {
		display.resize(window.innerWidth - 64, window.innerHeight - 64);
		display.render();
	};

	var keyDownUp = function(event) {
		controller.keyDownUp(event.type, event.keyCode);
	};

	var assets_manager = new AssetsManager();
	var controller = new Controller();
	var display = new Display(2);
	var game = new Game();
	var menu = new Menu(game, display);
	var engine = new Engine(1000/30, render, update);

	assets_manager.requestJSON('map/1.json', function(zone) {
		game.world.setup(zone);

		display.buffer.canvas.width = game.world.width;
		display.buffer.canvas.height = game.world.height;
	});

	assets_manager.requestImage('img/city_bg.png', function(image) {
		assets_manager.background_image = image;
	});

	assets_manager.requestImage("img/player.png", (image) => {
		assets_manager.player_image = image;
	});
	
	assets_manager.requestImage("img/tileset.png", (image) => {
		assets_manager.tile_set_image = image;

		resize();
		engine.start();
	});

	display.ctx.imageSmoothingEnabled = false;
	display.buffer.imageSmoothingEnabled = false;

	window.addEventListener('keydown', keyDownUp);
	window.addEventListener("keyup",   keyDownUp);
	window.addEventListener('resize', resize);
});