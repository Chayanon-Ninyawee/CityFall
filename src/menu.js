const Menu = function(game, display) {
	// BG music
	var bg_music = new Audio("sounds/bg_music.mp3");
	bg_music.loop = true;
	bg_music.volume = 0.05;

	// Setting Button

	let setting_button = document.getElementById("setting_button");
	setting_button.src = "img/setting.png";
	setting_button.style.position = "absolute";
	setting_button.style.opacity = "0.5";
	setting_button.style.top = setting_button.style.right = "30px"
	setting_button.style.cursor = "pointer";

	// Setting Menu

	let setting_menu = document.getElementById("setting_menu");
	setting_menu.style.position = "absolute";
	setting_menu.style.top = "50%";
	setting_menu.style.left = "50%";
	setting_menu.style.transform = "translate(-50%, -50%)";
	setting_menu.style.width = "30%";
	setting_menu.style.height = "80%";
	setting_menu.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
	setting_menu.style.display = "none";

	// Setting Menu Content

	let respawn_button = document.createElement("button");
	respawn_button.innerHTML = "Respawn";
	respawn_button.style.position = "absolute";
	respawn_button.style.top = "10%";
	respawn_button.style.left = "50%";
	respawn_button.style.transform = "translate(-50%, 0%)";
	respawn_button.style.width = "80%";
	respawn_button.style.height = "10%";
	respawn_button.style.backgroundColor = "rgba(255, 255, 0, 1)";

	let reset_game_button = document.createElement("button");
	reset_game_button.innerHTML = "Reset Game";
	reset_game_button.style.position = "absolute";
	reset_game_button.style.top = "20%";
	reset_game_button.style.left = "50%";
	reset_game_button.style.transform = "translate(-50%, 0%)";
	reset_game_button.style.width = "80%";
	reset_game_button.style.height = "10%";
	reset_game_button.style.backgroundColor = "rgba(255, 0, 0, 1)";

	let scale_input = document.createElement("input");
	scale_input.type = "number";
	scale_input.value = "2";
	scale_input.style.position = "absolute";
	scale_input.style.top = "30%";
	scale_input.style.left = "50%";
	scale_input.style.transform = "translate(-50%, 0%)";
	scale_input.style.width = "80%";
	scale_input.style.height = "10%";

	let scale_slider = document.createElement("input");
	scale_slider.type = "range";
	scale_slider.min = "0.5";
	scale_slider.max = "10";
	scale_slider.step = "0.1";
	scale_slider.value = "2";
	scale_slider.style.position = "absolute";
	scale_slider.style.top = "40%";
	scale_slider.style.left = "50%";
	scale_slider.style.transform = "translate(-50%, 0%)";
	scale_slider.style.width = "80%";
	scale_slider.style.height = "10%";

	setting_menu.appendChild(respawn_button);
	setting_menu.appendChild(reset_game_button);
	setting_menu.appendChild(scale_input);
	setting_menu.appendChild(scale_slider);

	setting_button.onmouseenter = function() {
		setting_button.style.opacity = "1";
	}

	setting_button.onmouseleave = function() {
		setting_button.style.opacity = "0.5";
	}

	setting_button.onclick = function() {
		if (setting_menu.style.display == "none") {
			setting_menu.style.display = "block";
		} else {
			setting_menu.style.display = "none";
		}
	}

	respawn_button.onclick = function() {
		console.log("respawn");
		game.world.player.respawn();
	}

	reset_game_button.onclick = function() {
		console.log("reset game");
		game.world.player.respawn();
		bg_music.pause();
		setting_menu.style.display = "none";
		document.getElementById("main_menu").style.display = "block";
	}

	scale_input.onchange = function() {
		scale_slider.value = scale_input.value;;
		display.changeScale(scale_input.value);
	}

	scale_slider.oninput = function() {
		scale_input.value = scale_slider.value;
		display.changeScale(scale_slider.value);
	}

	window.addEventListener('keydown', function(event) {
		if (event.keyCode == 27) {
			if (setting_menu.style.display == "none") {
				setting_menu.style.display = "block";
			} else {
				setting_menu.style.display = "none";
			}
		}
	});

	// Main menu
	let main_menu = document.getElementById("main_menu");
	main_menu.style.position = "absolute";
	main_menu.style.width = "100%";
	main_menu.style.height = "100%";
	main_menu.style.backgroundColor = "#0e1225";
	main_menu.style.display = "block";

	// Main menu content
	let title = document.createElement("h1");
	title.innerHTML = "City Fall";
	title.style.fontSize = "4em";
	title.style.fontFamily = "Common Pixel";
	title.style.color = "#ffffff";
	title.style.position = "absolute";
	title.style.top = "10%";
	title.style.left = "50%";
	title.style.transform = "translate(-50%, 0%)";

	let icon = document.createElement("img");
	icon.src = "img/icon.png";
	icon.style.imageRendering = "pixelated";
	icon.style.position = "absolute";
	icon.style.top = "50%";
	icon.style.left = "50%";
	icon.style.transform = "translate(-50%, -50%)";
	icon.style.height = "50%";
	icon.style.overflow = "hidden";

	let start_button = document.createElement("button");
	start_button.innerHTML = "Start";
	start_button.style.position = "absolute";
	start_button.style.top = "80%";
	start_button.style.left = "50%";
	start_button.style.transform = "translate(-50%, 0%)";
	start_button.style.width = "80%";
	start_button.style.height = "10%";
	start_button.style.backgroundColor = "rgba(255, 255, 0, 1)";

	main_menu.appendChild(title);
	main_menu.appendChild(icon);
	main_menu.appendChild(start_button);

	start_button.onclick = function() {
		game.world.player.respawn();
		main_menu.style.display = "none";
		bg_music.play();
		bg_music.currentTime = 0;
	}

	// Finish menu
	let finish_menu = document.getElementById("finish_menu");
	finish_menu.style.position = "absolute";
	finish_menu.style.width = "100%";
	finish_menu.style.height = "100%";
	finish_menu.style.backgroundColor = "#0e1225";
	finish_menu.style.display = "none";
	
	// Finish menu content
	let finish_title = document.createElement("h1");
	finish_title.innerHTML = "You Win!";
	finish_title.style.fontSize = "4em";
	finish_title.style.fontFamily = "Common Pixel";
	finish_title.style.color = "#ffffff";
	finish_title.style.position = "absolute";
	finish_title.style.top = "10%";
	finish_title.style.left = "50%";
	finish_title.style.transform = "translate(-50%, 0%)";

	let finish_icon = document.createElement("img");
	finish_icon.src = "img/icon.png";
	finish_icon.style.imageRendering = "pixelated";
	finish_icon.style.position = "absolute";
	finish_icon.style.top = "50%";
	finish_icon.style.left = "50%";
	finish_icon.style.transform = "translate(-50%, -50%)";
	finish_icon.style.height = "50%";
	finish_icon.style.overflow = "hidden";

	let finish_button = document.createElement("button");
	finish_button.innerHTML = "Restart";
	finish_button.style.position = "absolute";
	finish_button.style.top = "80%";
	finish_button.style.left = "50%";
	finish_button.style.transform = "translate(-50%, 0%)";
	finish_button.style.width = "80%";
	finish_button.style.height = "10%";
	finish_button.style.backgroundColor = "rgba(255, 255, 0, 1)";

	finish_menu.appendChild(finish_title);
	finish_menu.appendChild(finish_icon);
	finish_menu.appendChild(finish_button);

	finish_button.onclick = function() {
		game.world.player.respawn();
		finish_menu.style.display = "none";
		bg_music.play();
		bg_music.currentTime = 0;
	}

	this.finish = function() {
		bg_music.pause();
		finish_menu.style.display = "block";
	}
}

Menu.prototype = { constructor : Menu };