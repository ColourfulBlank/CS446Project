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


    gooseVisit() {
    	this.manager.carHit(this);
    },

});
