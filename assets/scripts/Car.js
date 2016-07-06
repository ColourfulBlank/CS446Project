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
        this.node.x = this.initX;
        this.node.y = this.initY;
    	this.carManager.despawn(this);
    },
});
