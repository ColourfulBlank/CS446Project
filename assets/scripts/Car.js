const Obstacle = require("Obstacle");

var Car = cc.Class({
    /*
    	Obstacle properties:
			speedX
			initX
			resetX
			initY
	*/
    extends: Obstacle,

    init(carManager) {
    	this.carManager = carManager;
    },

    gooseVisit() {
    	this.carManager.carHit(this);
    },

    reset() {
        console.log("car reset");
    	this.carManager.despawn(this);
    },
});
