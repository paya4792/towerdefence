// - enemy --------------------------------------------------------------------
function Enemy() {
	this.position = new Point();
	this.size = 0;
	this.type = 0;
	this.param = 0;
	this.interval_of_fire = 0;
	this.life = 0;
	this.speed = 0;
	this.reward = 0;
	this.randomx = 0;
	this.randomy = 0;
	this.alive = false;
}

Enemy.prototype.set = function (p, type, num) {

	this.position.x = p.x;
	this.position.y = p.y;
	this.type = type;
	this.param = 0;
	this.alive = true;
	this.randomx = Math.random() * 25.0 - Math.random() * 25.0;
	this.randomy = Math.random() * 25.0 - Math.random() * 25.0;

	switch (num) {
		case 0:
			this.size = 10;
			this.speed = 1.0;
			this.interval_of_fire = 60;
			this.reward = 5;
			this.life = 3;
			break;
		case 1:
			this.size = 12;
			this.speed = Math.random() * 0.5 + 0.5;
			this.interval_of_fire = 60;
			this.reward = 10;
			this.life = 5;
			break;
		case 2:
			this.size = 20;
			this.speed = Math.random() * 0.2 + 0.3;
			this.interval_of_fire = 80;
			this.reward = 20;
			this.life = 15;
			break;
		case 3:
			this.size = 6;
			this.speed = Math.random() * 1.0 + 0.5;
			this.interval_of_fire = 50;
			this.reward = 25;
			this.life = 5;
			break;
		case 4:
			this.size = 35;
			this.speed = Math.random() * 0.1 + 0.1;
			this.interval_of_fire = 30;
			this.reward = 100;
			this.life = 50;
			break;
		case 5:
			this.size = 25;
			this.speed = Math.random() * 0.8 + 0.5;
			this.interval_of_fire = 45;
			this.reward = 100;
			this.life = 25;
			break;
	}

};

Enemy.prototype.move = function () {

	this.param++;

	if (this.position.y + this.randomy < screenCanvas.height / 8) {
		this.position.y += this.speed;
	}
	else if (!(this.position.x + this.randomx < screenCanvas.width / 2 + 10 && this.position.x + this.randomx > screenCanvas.width / 2 - 10) && this.position.y + this.randomy < screenCanvas.height / 4) {
		switch (this.type) {
			case 0:
				this.position.x -= this.speed;

				break;
			case 1:
				this.position.x += this.speed;

				break;
		}
	}
	else if (this.position.y + this.randomy < screenCanvas.height / 4 + screenCanvas.height / 8) {
		this.position.y += this.speed;
	}
	else if (!(this.position.x + this.randomx > screenCanvas.width - 80 || this.position.x + this.randomx < 80) && this.position.y + this.randomy < screenCanvas.height / 2) {
		switch (this.type) {
			case 0:
				this.position.x -= this.speed;

				break;
			case 1:
				this.position.x += this.speed;

				break;
		}
	}
	else if ((this.position.x + this.randomx > screenCanvas.width - 80 || this.position.x + this.randomx < 80) && this.position.y + this.randomy < screenCanvas.height / 2 + screenCanvas.height / 8) {
		this.position.y += this.speed;
	}
	else if (!(this.position.x + this.randomx < screenCanvas.width / 2 + 10 && this.position.x + this.randomx > screenCanvas.width / 2 - 10) && this.position.y + this.randomy < screenCanvas.height / 2 + screenCanvas.height / 4) {
		switch (this.type) {
			case 0:
				this.position.x += this.speed;

				break;
			case 1:
				this.position.x -= this.speed;

				break;
		}
	}
	else if (this.position.y + this.randomy < screenCanvas.height - screenCanvas.height / 8) {
		this.position.y += this.speed;
	}
	else if (!(this.position.x + this.randomx > screenCanvas.width - 80 || this.position.x + this.randomx < 80) && this.position.y + this.randomy < screenCanvas.height) {
		switch (this.type) {
			case 0:
				this.position.x -= this.speed;

				break;
			case 1:
				this.position.x += this.speed;

				break;
		}
	}
	else {
		this.position.y += this.speed;
	}

	if (this.position.y > screenCanvas.height + this.size) {
		var s = new Scenario;
		s.gameOver();
		this.alive = false;
	}
};


// - enemy shot ---------------------------------------------------------------
function EnemyShot() {
	this.position = new Point();
	this.vector = new Point();
	this.size = 0;
	this.speed = 0;
	this.alive = false;
}

EnemyShot.prototype.set = function (p, vector, size, speed) {

	this.position.x = p.x;
	this.position.y = p.y;
	this.vector.x = vector.x;
	this.vector.y = vector.y;


	this.size = size;
	this.speed = speed;



	this.alive = true;
};

EnemyShot.prototype.move = function () {

	this.position.x += this.vector.x * this.speed;
	this.position.y += this.vector.y * this.speed;


	if (
		this.position.x < -this.size ||
		this.position.y < -this.size ||
		this.position.x > this.size + screenCanvas.width ||
		this.position.y > this.size + screenCanvas.height
	) {
		this.alive = false;
	}
};



