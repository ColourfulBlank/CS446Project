var Obstacle = cc.Class({
	extends: cc.Component,
	properties: {

		speedX: 		-600,
		initX: 			1600,
		resetX: 		-1600,
		
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


    init(manager) {
    	this.manager = manager;
    },

    reset() {
        this.node.x = this.initX;
        this.node.y = this.initY;
    	this.manager.despawn(this);
    },

	/*Treat the following as abstract methods*/

	/*
		---Visitor pattern---
		Called by Goose when goose collide with <this>
		Up to the concrete class to implement (decide what to do)
	*/
	gooseVisit() {
		console.log("**WARNING: Obstacle:gooseVisit(), an abstract method called");
	},











});
