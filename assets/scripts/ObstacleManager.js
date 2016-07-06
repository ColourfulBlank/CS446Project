var ObstacleManager = cc.Class({
	extends: cc.Component,

	properties: {
		prefab: cc.Prefab,
		layer: cc.Node,

		/*
			these properties wouldn't show in IDE, but use them as needed in script
				obstacleList: []
				game: GameManager
				isRunning: bool
		*/
	},
	
	//initialize with <game> -- GameManager
	//Don't forget to bind the concrete Obstacle Manager to "Game" and init in GameManager
	init(game) {
		this.isRunning = false;
		this.game = game;
		this.obstacleList = [];
	},

	//despawn an obstacle
	despawn (obstacle) {
		obstacle.node.removeFromParent();
		obstacle.node.active = false;
		cc.pool.putInPool(obstacle);
	},

	gameOver () {
		this.obstacleList = [];
		this.isRunning = false;
		this.stopSpawn();
	},

	/*Treat all of the following functions as abstract methods*/

	//spawn an obstacle
	spawn () {
		console.log("***WARNING: ObstacleManager:spawn(), an abstract method called");
	},

	//start spawning
	startSpawn() {
		console.log("***WARNING: ObstacleManager:startSpawn(), an abstract method called");	
	},

	stopSpawn() {
		console.log("***WARNING: ObstacleManager:startSpawn(), an abstract method called");	
	},


});
