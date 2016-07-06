const Car = require('Car');
const ObstacleManager = require("ObstacleManager");

var CarManager = cc.Class({
	extends: ObstacleManager,
	
	init(game) {
		this.isRunning = false;
		this.game = game;
		this.carList = [];
	},

	spawn () {
		if (!this.isRunning) {
			return;
		}
		let car = null;
		if (cc.pool.hasObject(Car)) {
			car = cc.pool.getFromPool(Car);
		} else {
			car = cc.instantiate(this.prefab).getComponent(Car);
		}
		this.layer.addChild(car.node);
		car.node.active = true;
		car.node.x = this.spawnPointX;
		car.init(this);
		this.carList.push(car);
	},

	despawn (car) {
		car.node.removeFromParent();
		car.node.active = false;
		cc.pool.putInPool(car);
	},

	startSpawn() {
		this.isRunning = true;
	},

	reset () {
		this.carList = [];
		this.isRunning = false;
	},
	
	carHit(car) {
		this.game.gameOver();
	},
});
