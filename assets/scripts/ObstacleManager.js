var ObstacleManager = cc.Class({
	extends: cc.Component,

	properties: {
		prefab: cc.Prefab,
		layer: cc.Node,
	},


	/*Treat all of the following functions as abstract methods*/
	
	//initialize with <game> -- GameManager
	//Don't forget to bind the concrete Obstacle Manager to "Game" and init in GameManager
	init(game) {
		console.log("***WARNING: ObstacleManager:init(game), an abstract method called");	
	},

	//spawn an obstacle
	spawn () {
		console.log("***WARNING: ObstacleManager:spawn(), an abstract method called");
	},
	
	//despawn an obstacle
	despawn (obstacle) {
		console.log("***WARNING: ObstacleManager:despawn(), an abstract method called");
	},

	//start spawning
	startSpawn() {
		console.log("***WARNING: ObstacleManager:startSpawn(), an abstract method called");	
	},

	//reset the manager
	reset () {
		console.log("***WARNING: ObstacleManager:reset(), an abstract method called");	
	},

});
