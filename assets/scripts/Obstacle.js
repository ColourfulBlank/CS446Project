/*
	Interface

	Any obstacle should extend this and overwrite the abstract methods
*/

var Obstacle = cc.Class({
	extends: cc.Component,
	properties: {
		speedX: 		-600,
		initX: 			1600,	//initial x coordinate
		resetX: 		-1600,	//x coordinate that the obstacle is reset(recycled)
		
		initY: 			0,		//initial y coordinate


		/*
			these properties wouldn't show in IDE, but use them as needed in script
				manager: ObstacleManager
		*/
	},


	onLoad: function() {
		this.node.x = this.initX;
		this.node.y = this.initY;
	},

	update(dt) {
		if (!this.manager.isRunning) {
			return;
		}

		this.node.x += this.speedX * dt;
		if (this.node.x < this.resetX) {
			this.despawn();
		}
	},

    init(manager) {
    	this.manager = manager;
    },

    reset() {
    	this.node.x = this.initX;
        this.node.y = this.initY;
    },

    despawn() {
    	this.reset();
        this.manager.despawn(this);
    },

	/*Treat the following as abstract methods*/

	/*
		---Visitor pattern---
		Called by Goose when goose collide with obstacle
		Up to the concrete class to implement (decide what to do)
	*/
	gooseVisit() {
		console.log("**WARNING: Obstacle:gooseVisit(), an abstract method called");
	},


});
