// set the configuration of the game
var config = {
	parent: 'gameWin',
	width: window.innerWidth,
	height: window.innerHeight - 100,
	type: Phaser.CANVAS,
	antialias: false,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	}

};

// create a new game, pass the configuration
var game = new Phaser.Game(config);

// initiate scene parameters
var playerSpeed = 3;

// enemy speed
var enemyMinSpeed = 2;
var enemyMaxSpeed = 4.5;

// boundaries
var enemyMinY = 80;
var enemyMaxY = 280;

// load assets
function preload() {
	// load images
	game.load.image("background", "background.png");
	game.load.image("player", "player.png");
	game.load.image("enemy", "enemy.png");
	game.load.image("weapon", "weapon.png");
}

// called once after the preload ends
function create() {
	// create bg image
	let bg = this.add.sprite(300, 400, "background");


	//create the player




	// goal
	game.weapon = this.add.sprite(0, 0, 'weapon');
	//set position
	game.weapon.setScale(3);
	game.weapon.setPosition(620, 180);

	// enemy group




	// set flipX, and speed
	Phaser.Actions.Call(
		this.enemies.getChildren(),
		function (enemy) {
			// flip enemy
			enemy.flipX = true;

			// set speed
			let dir = Math.random() < 0.5 ? 1 : -1;
			let speed =
				this.enemyMinSpeed +
				Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
			enemy.speed = dir * speed;
		},
		this
	);
};

// this is called up to 60 times per second
function update() {
	// check for active input (left click / touch)
	if (this.input.activePointer.isDown) {
		// player walks
		this.player.x += this.playerSpeed;
	}

	// treasure overlap check
	let playerRect = this.player.getBounds();
	let treasureRect = this.weapon.getBounds();

	if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
		alert("YOU DID IT!! YOU WON!!!");

		//ENDS GAME
		return this.gameOver();
	}

	// get enemies
	let enemies = this.enemies.getChildren();
	let numEnemies = enemies.length;

	for (let i = 0; i < numEnemies; i++) {
		// enemy movement
		enemies[i].y += enemies[i].speed;

		// check we haven't passed min or max Y
		let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
		let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

		// if we passed the upper or lower limit, reverse
		if (conditionUp || conditionDown) {
			enemies[i].speed *= -1;
		}

		// check enemy overlap
		let enemyRect = enemies[i].getBounds();

		if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
			console.log("Game over!");

			//ENDS GAME
			return this.gameOver();
		}
	}
};

gameScene.gameOver = function () {
	// restart the Scene
	this.scene.restart();

}



