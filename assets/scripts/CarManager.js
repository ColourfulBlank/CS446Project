const Car = require('Car');
const ObstacleManager = require("ObstacleManager");

var CarManager = cc.Class({
	extends: ObstacleManager,
	
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
		car.init(this);
		this.obstacleList.push(car);
	},



	startSpawn() {

console.log("car spon star");

		this.isRunning = true;
		this.schedule(this.spawn, 3);
	},

	stopSpawn() {
		this.unschedule(this.spawn);
	},


	carHit(car) {
		this.game.gameOver();
	},
});
