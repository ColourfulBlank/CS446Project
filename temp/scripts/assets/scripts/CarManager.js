"use strict";
cc._RFpush(module, '06896Hr5EhG963y1B6iVITX', 'CarManager');
// scripts/CarManager.js

var Car = require('Car');
var ObstacleManager = require("ObstacleManager");

var CarManager = cc.Class({
	"extends": ObstacleManager,

	spawn: function spawn() {
		if (!this.isRunning) {
			return;
		}
		var car = null;
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

	startSpawn: function startSpawn() {
		this.isRunning = true;
		this.schedule(this.spawn, 3);
	},

	stopSpawn: function stopSpawn() {
		this.unschedule(this.spawn);
	},

	carHit: function carHit(car) {
		this.game.gameOver();
	}
});

cc._RFpop();