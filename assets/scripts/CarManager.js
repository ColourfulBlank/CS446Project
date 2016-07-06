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

		console.log("spon")
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
		this.schedule(this.spawn, 20);
	},

	reset () {
		// this.unschedule(this.spawnHuman);
		this.carList = [];
		this.isRunning = false;
	},

	carHit(car) {
		this.game.gameOver();
	},
});
