const Game = function() {
  
	this.world = new Game.World();

	this.update = function() {
		this.world.update();
	};
};
  
Game.prototype = { constructor : Game };

// Maps

Game.TileSet = function(columns, tile_size) {
	this.columns    = columns;
	this.tile_size  = tile_size;

	let f = Game.Frame;

	this.frames = [	new f(201, 30, 19, 30, 0, 0), // idle-left
					new f(181, 30, 20, 30, 0, 0), new f(161, 30, 20, 30, 0, 0), new f(141, 30, 20, 30, 0, 0), new f(118, 30, 23, 30, -2, 0), new f(98, 30, 20, 30, 0, 0), new f(78, 30, 20, 30, 0, 0),  // walk-left
					new f(58, 30, 20, 30, 0, 0), new f(37, 30, 21, 30, 0, 0), new f(18, 30, 19, 30, 0, 0), new f(0, 30, 18, 30, 0, 0), // jump-left	
					new f( 0, 0, 19, 30, 0, 0), // idle-right
					new f(19, 0, 20, 30, 0, 0), new f(39,  0, 20, 30, 0, 0), new f(59,  0, 20, 30, 0, 0), new f(79,  0, 23, 30, 3, 0), new f(102,  0, 20, 30, 0, 0), new f(122,  0, 20, 30, 0, 0),  // walk-right
					new f(142,  0, 20, 30, 0, 0), new f(162,  0, 21, 30, 0, 0), new f(183,  0, 19, 30, 0, 0), new f(202,  0, 18, 30, -1, 0), // jump-right	
				];
};

Game.World = function() {
	this.collider  = new Game.Collider();

	this.tile_set = new Game.TileSet(12, 32);
	this.player   = new Game.Player(100, 100);

};

Game.World.prototype = {

	constructor: Game.World,

	collideObject:function(object) {
		for (var i = 0; i < this.collider_data.length; i++) {
			var top   = Math.round(this.collider_data[i].y);
			var left  = Math.round(this.collider_data[i].x);
			var right = Math.round(this.collider_data[i].x) + Math.round(this.collider_data[i].width);
			var bottom= Math.round(this.collider_data[i].y) + Math.round(this.collider_data[i].height);

			//console.log(this.collider_data[i].id, this.collider_data[i].type);
			  
			//console.log(top, left, right, bottom);

			if (object.getRight() > left && object.getLeft() < right) {
				this.collider.collideTop(object, top);
				if (this.collider_data[i].type != "t") {
					this.collider.collideBottom(object, bottom);
				}
			}
			if (object.getBottom() > top && object.getTop() < bottom) {
				if (this.collider_data[i].type != "t") {
					this.collider.collideLeft(object, left);
					this.collider.collideRight(object, right);
				}
			}
		}
	},

	setup:function(zone) {
		this.data		= zone.data;
		this.collider_data = zone.collider;
		this.columns	= zone.columns;
		this.rows		= zone.rows;
		this.width        = this.tile_set.tile_size * this.columns;
		this.height       = this.tile_set.tile_size * this.rows;
		this.zone_id	= zone.id;
	},

	update:function() {
		this.player.updatePosition(1.2);
		this.collideObject(this.player);
		this.player.updateAnimation();
		this.player.checkDead(this.height);
	}
}

// Collision detection

Game.Collider = function() {

	this.collideBottom = function(object, collider_buttom) {
		if (object.getTop() < collider_buttom && object.getOldTop() >= collider_buttom) {
			object.setTop(collider_buttom);
			object.velocity_y = 0;
			return true;
		}
		return false;
	}

	this.collideLeft = function(object, collider_left) {
		if (object.getRight() > collider_left && object.getOldRight() <= collider_left) {
			object.setRight(collider_left - 0.01);
			object.velocity_x = 0;
			return true;
		}
		return false;
	}

	this.collideRight = function(object, collider_right) {
		if (object.getLeft() < collider_right && object.getOldLeft() >= collider_right) {
			object.setLeft(collider_right);
			object.velocity_x = 0;
			return true;
		}
		return false;
	}

	this.collideTop = function(object, collider_top) {
		if (object.getBottom() > collider_top && object.getOldBottom() <= collider_top) {
			object.setBottom(collider_top - 0.01);
			object.velocity_y = 0;
			object.jumping = false;
			return true;
		}
		return false;
	}

};

// Object

Game.Object = function(x, y, width, height) {
	this.height = height;
	this.width  = width;
	this.x      = x;
	this.y      = y;
};
Game.Object.prototype = {

	constructor:Game.Object,

	getBottom : function()  { return this.y + this.height;       },
	getCenterX: function()  { return this.x + this.width  * 0.5; },
	getCenterY: function()  { return this.y + this.height * 0.5; },
	getLeft   : function()  { return this.x;                     },
	getRight  : function()  { return this.x + this.width;        },
	getTop    : function()  { return this.y;                     },
	setBottom : function(y) { this.y = y - this.height;          },
	setCenterX: function(x) { this.x = x - this.width  * 0.5;    },
	setCenterY: function(y) { this.y = y - this.height * 0.5;    },
	setLeft   : function(x) { this.x = x;                        },
	setRight  : function(x) { this.x = x - this.width;           },
	setTop    : function(y) { this.y = y;                        }

};

Game.MovingObject = function(x, y, width, height, velocity_max = 15) {

	Game.Object.call(this, x, y, width, height);

	this.jumping      = false;
	this.velocity_max = velocity_max;
	this.velocity_x   = 0;
	this.velocity_y   = 0;
	this.x_old        = x;
	this.y_old        = y;

};

Game.MovingObject.prototype = {

	getOldBottom : function()  { return this.y_old + this.height;       },
	getOldCenterX: function()  { return this.x_old + this.width  * 0.5; },
	getOldCenterY: function()  { return this.y_old + this.height * 0.5; },
	getOldLeft   : function()  { return this.x_old;                     },
	getOldRight  : function()  { return this.x_old + this.width;        },
	getOldTop    : function()  { return this.y_old;                     },
	setOldBottom : function(y) { this.y_old = y    - this.height;       },
	setOldCenterX: function(x) { this.x_old = x    - this.width  * 0.5; },
	setOldCenterY: function(y) { this.y_old = y    - this.height * 0.5; },
	setOldLeft   : function(x) { this.x_old = x;                        },
	setOldRight  : function(x) { this.x_old = x    - this.width;        },
	setOldTop    : function(y) { this.y_old = y;                        }

};
Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;

// Animation

Game.Animator = function(frame_set, delay, mode = "loop") {

	this.count       = 0;
	this.delay       = (delay >= 1) ? delay : 1;
	this.frame_set   = frame_set;
	this.frame_index = 0;
	this.frame_value = frame_set[0];
	this.mode        = mode;

};
Game.Animator.prototype = {

	constructor:Game.Animator,

	animate:function() {
		switch(this.mode) {
			case "loop" : this.loop(); break;
			case "pause":              break;
		}
	},

	changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {
		if (this.frame_set === frame_set) { return; }

		this.count       = 0;
		this.delay       = delay;
		this.frame_set   = frame_set;
		this.frame_index = frame_index;
		this.frame_value = frame_set[frame_index];
		this.mode        = mode;
	},

	loop:function() {
		this.count ++;

		while(this.count > this.delay) {
			this.count -= this.delay;
			this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;
			this.frame_value = this.frame_set[this.frame_index];
		}
	}

};

Game.Frame = function(x, y, width, height, offset_x = 0, offset_y = 0) {
	this.x        = x;
	this.y        = y;
	this.width    = width;
	this.height   = height;
	this.offset_x = offset_x;
	this.offset_y = offset_y;
};
Game.Frame.prototype = { constructor: Game.Frame };

// Player

Game.Player = function(x, y) {
	Game.MovingObject.call(this, x, y, 12, 30);
	Game.Animator.call(this, Game.Player.prototype.frame_sets["idle-left"], 10);
  
	this.jumping     = true;
	this.direction_x = -1;
	this.velocity_x  = 0;
	this.velocity_y  = 0;

};

Game.Player.prototype = {

	constructor:Game.Player,

	frame_sets: {
		"idle-left" : [0],
		"jump-left" : [7, 8, 8, 8],
		"end-left"  : [8],
		"down-left" : [9, 10],
		"move-left" : [1, 2, 3, 4, 5, 6],
		"idle-right": [11],
		"jump-right": [18, 19, 19, 19],
		"end-right" : [19],
		"down-right": [20, 21],
		"move-right": [12, 13, 14, 15, 16, 17],
	},

	jump:function() {
		if (!this.jumping) {
			this.jumping     = true;
			this.velocity_y = -22;
		}
	},

	moveLeft:function()  {
		this.direction_x = -1;
		this.velocity_x = -8;
	},

	moveRight:function() {
		this.direction_x = 1;
		this.velocity_x =  8;
	},

	moveNone:function()  { this.velocity_x =  0; },

	respawn:function() {
		this.x_old = undefined;
		this.y_old = undefined;
		this.x = 100;
		this.y = 100;
	},

	checkDead:function(world_heigth) {
		if (this.y > world_heigth) {
			this.respawn();
		}
	},

	updateAnimation:function() {
		if (this.velocity_y < 0) {
			if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["jump-left"], "loop", 5);
			else this.changeFrameSet(this.frame_sets["jump-right"], "loop", 5);
		} else if (this.velocity_y > 0) {
			if (this.velocity_y < 1) {
				if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["end-left"], "pause");
				else this.changeFrameSet(this.frame_sets["end-right"], "pause");
			} else {
				if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["down-left"], "loop", 3);
				else this.changeFrameSet(this.frame_sets["down-right"], "loop", 3);
			}
		} else if (this.direction_x < 0) {
			if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 4);
			else this.changeFrameSet(this.frame_sets["idle-left"], "pause");
		} else if (this.direction_x > 0) {
			if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 4);
			else this.changeFrameSet(this.frame_sets["idle-right"], "pause");
		}
		this.animate();
	},

	updatePosition:function(gravity) {
		this.x_old = this.x;
		this.y_old = this.y;

		this.velocity_y += gravity;

		if (Math.abs(this.velocity_x) > this.velocity_max)
		this.velocity_x = this.velocity_max * Math.sign(this.velocity_x);
	
		if (Math.abs(this.velocity_y) > this.velocity_max)
		this.velocity_y = this.velocity_max * Math.sign(this.velocity_y);

		this.x    += this.velocity_x;
		this.y    += this.velocity_y;
	}
};
Object.assign(Game.Player.prototype, Game.MovingObject.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;