var Obstacle = cc.Class({
	extends: cc.Component,
	properties: {

		speedX: 		100,
		initX: 			200,
		resetX: 		-100,
		
		initY: 			0,
	},

	onLoad: function() {
		this.node.x = this.initX;
		this.node.y = this.initY;
	},

	update(dt) {
		this.node.x += this.speedX * dt;
		if (this.node.x < this.resetX) {
			this.reset();
		}
	},

	/*Treat the following as abstract methods*/


	//to reset when x pass resetX
	reset() {
		console.log("**WARNING: Obstacle:reset(), an abstract method called");
	},

	/*
		---Visitor pattern---
		Called by Goose when goose collide with <this>
		Up to the concrete class to implement (decide what to do)
	*/
	gooseVisit() {
		console.log("**WARNING: Obstacle:gooseVisit(), an abstract method called");
	},
});
