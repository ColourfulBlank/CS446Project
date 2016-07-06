/*
	Interface

	Any obstacle manager should extend this and overwrite the abstract methods
*/

var ObstacleManager = cc.Class({
	extends: cc.Component,

	properties: {
		prefab: cc.Prefab,	//prefab of obstacle
		layer: cc.Node,		//layer where obstacle is added into

		/*
			these properties wouldn't show in IDE, but they exist
				obstacleList: []	//list of obstacles under management
				game: GameManager	//game manager
				isRunning: bool
		*/
	},
	
	//initialize with <game> -- GameManager
	//Don't forget to bind the concrete Obstacle Manager to a node
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

	//called by game manager to notify gameover
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
