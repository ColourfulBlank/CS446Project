require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CarManager":[function(require,module,exports){
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
},{"Car":"Car","ObstacleManager":"ObstacleManager"}],"Car":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bd45aCnlh9BU4QGW5CS7JGk', 'Car');
// scripts/Car.js

var Obstacle = require("Obstacle");

var Car = cc.Class({
    /*
    	Obstacle properties:
    speedX
    initX
    resetX
    initY
    */
    "extends": Obstacle,

    gooseVisit: function gooseVisit() {
        this.manager.carHit(this);
    }

});

cc._RFpop();
},{"Obstacle":"Obstacle"}],"GameManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8dfcd67JoFBH6J/EcZmXuoI', 'GameManager');
// scripts/GameManager.js

var Goose = require('Goose');
var ObstacleManager = require('ObstacleManager');

var GameState = cc.Enum({
    Menu: -1,
    Run: -1,
    Over: -1
});

var GameManager = cc.Class({
    'extends': cc.Component,
    properties: {
        goose: Goose,
        managers: {
            'default': [],
            type: [ObstacleManager]
        },
        gameOverMenu: cc.Node,
        scoreText: cc.Label,
        gameBgAudio: {
            'default': null,
            url: cc.AudioClip
        },
        dieAudio: {
            'default': null,
            url: cc.AudioClip
        },
        gameOverAudio: {
            'default': null,
            url: cc.AudioClip
        },
        scoreAudio: {
            'default': null,
            url: cc.AudioClip
        }
    },
    onLoad: function onLoad() {

        console.log("onload!!!");
        this.gameState = GameState.Menu;
        this.score = 0;
        this.scoreText.string = this.score;
        this.gameOverMenu.active = false;
        this.goose.init(this);

        for (var i = 0; i < this.managers.length; i++) {
            var manager = this.managers[i];
            manager.init(this);
        }

        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;

        this.start();
    },
    start: function start() {
        this.gameState = GameState.Run;
        this.score = 0;
        for (var i = 0; i < this.managers.length; i++) {
            var manager = this.managers[i];
            manager.startSpawn();
        }
        this.goose.startRun();
    },
    gameOver: function gameOver() {
        this.goose.state = Goose.State.Dead;
        this.goose.enableInput(false);

        // cc.audioEngine.stopMusic(this.gameBgAudio);
        // cc.audioEngine.playEffect(this.dieAudio);
        // cc.audioEngine.playEffect(this.gameOverAudio);
        for (var i = 0; i < this.managers.length; i++) {
            var manager = this.managers[i];
            manager.gameOver();
        }

        this.gameState = GameState.Over;
        this.gameOverMenu.active = true;
        this.gameOverMenu.getComponent('GameOverMenu').score.string = this.score;
    },
    gainScore: function gainScore() {
        this.score++;
        this.scoreText.string = this.score;
        // cc.audioEngine.playEffect(this.scoreAudio);
    }
});

cc._RFpop();
},{"Goose":"Goose","ObstacleManager":"ObstacleManager"}],"GameOverMenu":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4678eF13qtCHJNCsB0DibjM', 'GameOverMenu');
// scripts/GameOverMenu.js

var GameOverMenu = cc.Class({
    'extends': cc.Component,
    properties: {
        btn_play: cc.Button,
        score: cc.Label
    },
    init: function init() {},
    restart: function restart() {
        cc.director.loadScene('Game');
    }
});

cc._RFpop();
},{}],"Goose":[function(require,module,exports){
"use strict";
cc._RFpush(module, '21f81RgzrBIML5z30QRl75G', 'Goose');
// scripts/Goose.js

var Obstacle = require("Obstacle");

var State = cc.Enum({
    None: -1,
    Run: -1,
    Jump: -1,
    Drop: -1,
    DropEnd: -1,
    Dead: -1
});

var Sheep = cc.Class({
    "extends": cc.Component,
    properties: {
        colliderRadius: 0,
        maxY: 0,
        groundY: 0,
        gravity: 0,
        initJumpSpeed: 0,
        _state: {
            "default": State.None,
            type: State,
            visible: false
        },
        state: {
            get: function get() {
                return this._state;
            },
            set: function set(value) {
                if (value !== this._state) {
                    this._state = value;
                    if (this._state !== State.None) {
                        var animName = State[this._state];
                        this.anim.stop();
                        this.anim.play(animName);
                    }
                }
            },
            type: State
        },
        jumpAudio: {
            "default": null,
            url: cc.AudioClip
        }
    },
    statics: {
        State: State
    },
    init: function init(game) {
        this.game = game;
        this.anim = this.getComponent(cc.Animation);
        this.currentSpeed = 0;
        this.sprite = this.getComponent(cc.Sprite);
        this.registerInput();

        this.groundY = this.node.y;
    },
    startRun: function startRun() {
        this.state = State.Run;
        this.enableInput(true);
    },
    registerInput: function registerInput() {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: (function (keyCode, event) {
                this.jump();
            }).bind(this)
        }, this.node);
        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: (function (touch, event) {
                this.jump();
                return true;
            }).bind(this)
        }, this.node);
    },
    enableInput: function enableInput(enable) {
        if (enable) {
            cc.eventManager.resumeTarget(this.node);
        } else {
            cc.eventManager.pauseTarget(this.node);
        }
    },

    update: function update(dt) {
        if (this.state === State.None || this.state === State.Dead) {
            return;
        }
        this._updateState(dt);
        this._updatePosition(dt);
    },
    _updateState: function _updateState(dt) {
        switch (this.state) {
            case Sheep.State.Jump:
                if (this.currentSpeed < 0) {
                    this.state = State.Drop;
                }
                break;
            case Sheep.State.Drop:
                if (this.node.y < this.groundY) {
                    this.node.y = this.groundY;
                    this.state = State.DropEnd;
                }
                break;
        }
    },
    onDropFinished: function onDropFinished() {
        this.state = State.Run;
    },
    _updatePosition: function _updatePosition(dt) {
        var flying = this.state === Sheep.State.Jump || this.node.y > this.groundY;
        if (flying) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
        }
    },
    jump: function jump() {
        this.state = State.Jump;
        this.currentSpeed = this.initJumpSpeed;
        console.log(1123);
        // cc.audioEngine.playEffect(this.jumpAudio);
    },

    onCollisionEnter: function onCollisionEnter(other, self) {

        console.log("dasfadsfasd");
        other.getComponent(Obstacle).gooseVisit();
    }
});

cc._RFpop();
},{"Obstacle":"Obstacle"}],"HumanManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '41076pC+uJLP7KsDU38LA/D', 'HumanManager');
// scripts/HumanManager.js

/*
    Human manager

    More precisely, huaman isn't an "obstacle", since it doesn't kill the goose
    But it behaves like an obstacle
    Thus Human implements Obstacle interface and HumanManager implements ObstacleManager interface
*/

var Human = require('Human');
var ObstacleManager = require("ObstacleManager");

var HumanManager = cc.Class({
    "extends": ObstacleManager,

    /*Implementing abstract method in ObstacleManager*/
    startSpawn: function startSpawn() {
        this.isRunning = true;
        this.schedule(this.spawn, 1);
    },
    spawn: function spawn() {
        if (!this.isRunning) {
            return;
        }

        var human = null;
        if (cc.pool.hasObject(Human)) {
            human = cc.pool.getFromPool(Human);
        } else {
            human = cc.instantiate(this.prefab).getComponent(Human);
        }
        this.layer.addChild(human.node);
        human.node.active = true;
        human.init(this);
        this.obstacleList.push(human);
    },
    stopSpawn: function stopSpawn() {
        this.unschedule(this.spawn);
    },
    gainScore: function gainScore() {
        this.game.gainScore();
    }
});

cc._RFpop();
},{"Human":"Human","ObstacleManager":"ObstacleManager"}],"Human":[function(require,module,exports){
"use strict";
cc._RFpush(module, '506c3/W+f5PH4D8eAX3DQik', 'Human');
// scripts/Human.js

var Obstacle = require("Obstacle");

var Human = cc.Class({
    /*
        Obstacle properties:
            speedX
            initX
            resetX
            initY
    */
    "extends": Obstacle,

    gooseVisit: function gooseVisit() {
        this.manager.gainScore(this);
    }
});

cc._RFpop();
},{"Obstacle":"Obstacle"}],"ObstacleManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '40d50LgNChHeK/RKUjvvWfw', 'ObstacleManager');
// scripts/ObstacleManager.js

/*
	Interface

	Any obstacle manager should extend this and overwrite the abstract methods
*/

var ObstacleManager = cc.Class({
	"extends": cc.Component,

	properties: {
		prefab: cc.Prefab, //prefab of obstacle
		layer: cc.Node },

	//layer where obstacle is added into

	/*
 	these properties wouldn't show in IDE, but they exist
 		obstacleList: []	//list of obstacles under management
 		game: GameManager	//game manager
 		isRunning: bool
 */
	//initialize with <game> -- GameManager
	//Don't forget to bind the concrete Obstacle Manager to a node
	init: function init(game) {
		this.isRunning = false;
		this.game = game;
		this.obstacleList = [];
	},

	//despawn an obstacle
	despawn: function despawn(obstacle) {
		obstacle.node.removeFromParent();
		obstacle.node.active = false;
		cc.pool.putInPool(obstacle);
	},

	//called by game manager to notify gameover
	gameOver: function gameOver() {
		this.obstacleList = [];
		this.isRunning = false;
		this.stopSpawn();
	},

	/*Treat all of the following functions as abstract methods*/

	//spawn an obstacle
	spawn: function spawn() {
		console.log("***WARNING: ObstacleManager:spawn(), an abstract method called");
	},

	//start spawning
	startSpawn: function startSpawn() {
		console.log("***WARNING: ObstacleManager:startSpawn(), an abstract method called");
	},

	stopSpawn: function stopSpawn() {
		console.log("***WARNING: ObstacleManager:startSpawn(), an abstract method called");
	}

});

cc._RFpop();
},{}],"Obstacle":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6d67fGJaylG8K/AN8r08g8T', 'Obstacle');
// scripts/Obstacle.js

/*
	Interface

	Any obstacle should extend this and overwrite the abstract methods
*/

var Obstacle = cc.Class({
	"extends": cc.Component,
	properties: {
		speedX: -600,
		initX: 1600, //initial x coordinate
		resetX: -1600, //x coordinate that the obstacle is reset(recycled)

		initY: 0 },

	//initial y coordinate

	/*
 	these properties wouldn't show in IDE, but use them as needed in script
 		manager: ObstacleManager
 */
	onLoad: function onLoad() {
		this.node.x = this.initX;
		this.node.y = this.initY;
	},

	update: function update(dt) {
		if (!this.manager.isRunning) {
			return;
		}

		this.node.x += this.speedX * dt;
		if (this.node.x < this.resetX) {
			this.reset();
		}
	},

	init: function init(manager) {
		this.manager = manager;
	},

	reset: function reset() {
		this.node.x = this.initX;
		this.node.y = this.initY;
		this.manager.despawn(this);
	},

	/*Treat the following as abstract methods*/

	/*
 	---Visitor pattern---
 	Called by Goose when goose collide with obstacle
 	Up to the concrete class to implement (decide what to do)
 */
	gooseVisit: function gooseVisit() {
		console.log("**WARNING: Obstacle:gooseVisit(), an abstract method called");
	}

});

cc._RFpop();
},{}],"Scroller":[function(require,module,exports){
"use strict";
cc._RFpush(module, '930d5LshrZBkbsK0b05li7R', 'Scroller');
// scripts/Scroller.js

/*
	Scroll background and reset at certain point, so that it looks like an infinate looping backgroun
*/

var Scroller = cc.Class({
	"extends": cc.Component,
	properties: {
		speed: 0, //speed of scrolling
		resetX: 0 },

	//reset point
	update: function update(dt) {
		this.node.x += this.speed * dt;
		if (this.node.x <= this.resetX) {
			this.node.x -= this.resetX;
		}
	}
});

cc._RFpop();
},{}]},{},["CarManager","Goose","ObstacleManager","HumanManager","GameOverMenu","Human","Obstacle","GameManager","Scroller","Car"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdHMvQ2FyTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL0Nhci5qcyIsImFzc2V0cy9zY3JpcHRzL0dhbWVNYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvR2FtZU92ZXJNZW51LmpzIiwiYXNzZXRzL3NjcmlwdHMvR29vc2UuanMiLCJhc3NldHMvc2NyaXB0cy9IdW1hbk1hbmFnZXIuanMiLCJhc3NldHMvc2NyaXB0cy9IdW1hbi5qcyIsImFzc2V0cy9zY3JpcHRzL09ic3RhY2xlTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL09ic3RhY2xlLmpzIiwiYXNzZXRzL3NjcmlwdHMvU2Nyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzA2ODk2SHI1RWhHOTYzeTFCNmlWSVRYJywgJ0Nhck1hbmFnZXInKTtcbi8vIHNjcmlwdHMvQ2FyTWFuYWdlci5qc1xuXG52YXIgQ2FyID0gcmVxdWlyZSgnQ2FyJyk7XG52YXIgT2JzdGFjbGVNYW5hZ2VyID0gcmVxdWlyZShcIk9ic3RhY2xlTWFuYWdlclwiKTtcblxudmFyIENhck1hbmFnZXIgPSBjYy5DbGFzcyh7XG5cdFwiZXh0ZW5kc1wiOiBPYnN0YWNsZU1hbmFnZXIsXG5cblx0c3Bhd246IGZ1bmN0aW9uIHNwYXduKCkge1xuXHRcdGlmICghdGhpcy5pc1J1bm5pbmcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dmFyIGNhciA9IG51bGw7XG5cdFx0aWYgKGNjLnBvb2wuaGFzT2JqZWN0KENhcikpIHtcblx0XHRcdGNhciA9IGNjLnBvb2wuZ2V0RnJvbVBvb2woQ2FyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2FyID0gY2MuaW5zdGFudGlhdGUodGhpcy5wcmVmYWIpLmdldENvbXBvbmVudChDYXIpO1xuXHRcdH1cblx0XHR0aGlzLmxheWVyLmFkZENoaWxkKGNhci5ub2RlKTtcblx0XHRjYXIubm9kZS5hY3RpdmUgPSB0cnVlO1xuXHRcdGNhci5pbml0KHRoaXMpO1xuXHRcdHRoaXMub2JzdGFjbGVMaXN0LnB1c2goY2FyKTtcblx0fSxcblxuXHRzdGFydFNwYXduOiBmdW5jdGlvbiBzdGFydFNwYXduKCkge1xuXHRcdHRoaXMuaXNSdW5uaW5nID0gdHJ1ZTtcblx0XHR0aGlzLnNjaGVkdWxlKHRoaXMuc3Bhd24sIDMpO1xuXHR9LFxuXG5cdHN0b3BTcGF3bjogZnVuY3Rpb24gc3RvcFNwYXduKCkge1xuXHRcdHRoaXMudW5zY2hlZHVsZSh0aGlzLnNwYXduKTtcblx0fSxcblxuXHRjYXJIaXQ6IGZ1bmN0aW9uIGNhckhpdChjYXIpIHtcblx0XHR0aGlzLmdhbWUuZ2FtZU92ZXIoKTtcblx0fVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiZDQ1YUNubGg5QlU0UUdXNUNTN0pHaycsICdDYXInKTtcbi8vIHNjcmlwdHMvQ2FyLmpzXG5cbnZhciBPYnN0YWNsZSA9IHJlcXVpcmUoXCJPYnN0YWNsZVwiKTtcblxudmFyIENhciA9IGNjLkNsYXNzKHtcbiAgICAvKlxuICAgIFx0T2JzdGFjbGUgcHJvcGVydGllczpcbiAgICBzcGVlZFhcbiAgICBpbml0WFxuICAgIHJlc2V0WFxuICAgIGluaXRZXG4gICAgKi9cbiAgICBcImV4dGVuZHNcIjogT2JzdGFjbGUsXG5cbiAgICBnb29zZVZpc2l0OiBmdW5jdGlvbiBnb29zZVZpc2l0KCkge1xuICAgICAgICB0aGlzLm1hbmFnZXIuY2FySGl0KHRoaXMpO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4ZGZjZDY3Sm9GQkg2Si9FY1ptWHVvSScsICdHYW1lTWFuYWdlcicpO1xuLy8gc2NyaXB0cy9HYW1lTWFuYWdlci5qc1xuXG52YXIgR29vc2UgPSByZXF1aXJlKCdHb29zZScpO1xudmFyIE9ic3RhY2xlTWFuYWdlciA9IHJlcXVpcmUoJ09ic3RhY2xlTWFuYWdlcicpO1xuXG52YXIgR2FtZVN0YXRlID0gY2MuRW51bSh7XG4gICAgTWVudTogLTEsXG4gICAgUnVuOiAtMSxcbiAgICBPdmVyOiAtMVxufSk7XG5cbnZhciBHYW1lTWFuYWdlciA9IGNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdvb3NlOiBHb29zZSxcbiAgICAgICAgbWFuYWdlcnM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogW10sXG4gICAgICAgICAgICB0eXBlOiBbT2JzdGFjbGVNYW5hZ2VyXVxuICAgICAgICB9LFxuICAgICAgICBnYW1lT3Zlck1lbnU6IGNjLk5vZGUsXG4gICAgICAgIHNjb3JlVGV4dDogY2MuTGFiZWwsXG4gICAgICAgIGdhbWVCZ0F1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBkaWVBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgZ2FtZU92ZXJBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgc2NvcmVBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJvbmxvYWQhISFcIik7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLk1lbnU7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLnNjb3JlVGV4dC5zdHJpbmcgPSB0aGlzLnNjb3JlO1xuICAgICAgICB0aGlzLmdhbWVPdmVyTWVudS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nb29zZS5pbml0KHRoaXMpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tYW5hZ2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1hbmFnZXIgPSB0aGlzLm1hbmFnZXJzW2ldO1xuICAgICAgICAgICAgbWFuYWdlci5pbml0KHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbGxpc2lvbk1hbmFnZXIgPSBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCk7XG4gICAgICAgIGNvbGxpc2lvbk1hbmFnZXIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH0sXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLmdhbWVTdGF0ZSA9IEdhbWVTdGF0ZS5SdW47XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubWFuYWdlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtYW5hZ2VyID0gdGhpcy5tYW5hZ2Vyc1tpXTtcbiAgICAgICAgICAgIG1hbmFnZXIuc3RhcnRTcGF3bigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ29vc2Uuc3RhcnRSdW4oKTtcbiAgICB9LFxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICAgICAgdGhpcy5nb29zZS5zdGF0ZSA9IEdvb3NlLlN0YXRlLkRlYWQ7XG4gICAgICAgIHRoaXMuZ29vc2UuZW5hYmxlSW5wdXQoZmFsc2UpO1xuXG4gICAgICAgIC8vIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYyh0aGlzLmdhbWVCZ0F1ZGlvKTtcbiAgICAgICAgLy8gY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmRpZUF1ZGlvKTtcbiAgICAgICAgLy8gY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmdhbWVPdmVyQXVkaW8pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubWFuYWdlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtYW5hZ2VyID0gdGhpcy5tYW5hZ2Vyc1tpXTtcbiAgICAgICAgICAgIG1hbmFnZXIuZ2FtZU92ZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLk92ZXI7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJNZW51LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJNZW51LmdldENvbXBvbmVudCgnR2FtZU92ZXJNZW51Jykuc2NvcmUuc3RyaW5nID0gdGhpcy5zY29yZTtcbiAgICB9LFxuICAgIGdhaW5TY29yZTogZnVuY3Rpb24gZ2FpblNjb3JlKCkge1xuICAgICAgICB0aGlzLnNjb3JlKys7XG4gICAgICAgIHRoaXMuc2NvcmVUZXh0LnN0cmluZyA9IHRoaXMuc2NvcmU7XG4gICAgICAgIC8vIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQ2NzhlRjEzcXRDSEpOQ3NCMERpYmpNJywgJ0dhbWVPdmVyTWVudScpO1xuLy8gc2NyaXB0cy9HYW1lT3Zlck1lbnUuanNcblxudmFyIEdhbWVPdmVyTWVudSA9IGNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJ0bl9wbGF5OiBjYy5CdXR0b24sXG4gICAgICAgIHNjb3JlOiBjYy5MYWJlbFxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHt9LFxuICAgIHJlc3RhcnQ6IGZ1bmN0aW9uIHJlc3RhcnQoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnR2FtZScpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjFmODFSZ3pyQklNTDV6MzBRUmw3NUcnLCAnR29vc2UnKTtcbi8vIHNjcmlwdHMvR29vc2UuanNcblxudmFyIE9ic3RhY2xlID0gcmVxdWlyZShcIk9ic3RhY2xlXCIpO1xuXG52YXIgU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBOb25lOiAtMSxcbiAgICBSdW46IC0xLFxuICAgIEp1bXA6IC0xLFxuICAgIERyb3A6IC0xLFxuICAgIERyb3BFbmQ6IC0xLFxuICAgIERlYWQ6IC0xXG59KTtcblxudmFyIFNoZWVwID0gY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBjb2xsaWRlclJhZGl1czogMCxcbiAgICAgICAgbWF4WTogMCxcbiAgICAgICAgZ3JvdW5kWTogMCxcbiAgICAgICAgZ3Jhdml0eTogMCxcbiAgICAgICAgaW5pdEp1bXBTcGVlZDogMCxcbiAgICAgICAgX3N0YXRlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogU3RhdGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IFN0YXRlLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlICE9PSBTdGF0ZS5Ob25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbU5hbWUgPSBTdGF0ZVt0aGlzLl9zdGF0ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW0uc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltLnBsYXkoYW5pbU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IFN0YXRlXG4gICAgICAgIH0sXG4gICAgICAgIGp1bXBBdWRpbzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFN0YXRlOiBTdGF0ZVxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuYW5pbSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gMDtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5wdXQoKTtcblxuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLm5vZGUueTtcbiAgICB9LFxuICAgIHN0YXJ0UnVuOiBmdW5jdGlvbiBzdGFydFJ1bigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFN0YXRlLlJ1bjtcbiAgICAgICAgdGhpcy5lbmFibGVJbnB1dCh0cnVlKTtcbiAgICB9LFxuICAgIHJlZ2lzdGVySW5wdXQ6IGZ1bmN0aW9uIHJlZ2lzdGVySW5wdXQoKSB7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogKGZ1bmN0aW9uIChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuanVtcCgpO1xuICAgICAgICAgICAgfSkuYmluZCh0aGlzKVxuICAgICAgICB9LCB0aGlzLm5vZGUpO1xuICAgICAgICAvLyB0b3VjaCBpbnB1dFxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogKGZ1bmN0aW9uICh0b3VjaCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmp1bXAoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pLmJpbmQodGhpcylcbiAgICAgICAgfSwgdGhpcy5ub2RlKTtcbiAgICB9LFxuICAgIGVuYWJsZUlucHV0OiBmdW5jdGlvbiBlbmFibGVJbnB1dChlbmFibGUpIHtcbiAgICAgICAgaWYgKGVuYWJsZSkge1xuICAgICAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzLm5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMubm9kZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFN0YXRlLk5vbmUgfHwgdGhpcy5zdGF0ZSA9PT0gU3RhdGUuRGVhZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKGR0KTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oZHQpO1xuICAgIH0sXG4gICAgX3VwZGF0ZVN0YXRlOiBmdW5jdGlvbiBfdXBkYXRlU3RhdGUoZHQpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFNoZWVwLlN0YXRlLkp1bXA6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFNwZWVkIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gU3RhdGUuRHJvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoZWVwLlN0YXRlLkRyb3A6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubm9kZS55IDwgdGhpcy5ncm91bmRZKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ncm91bmRZO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gU3RhdGUuRHJvcEVuZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRHJvcEZpbmlzaGVkOiBmdW5jdGlvbiBvbkRyb3BGaW5pc2hlZCgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFN0YXRlLlJ1bjtcbiAgICB9LFxuICAgIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gX3VwZGF0ZVBvc2l0aW9uKGR0KSB7XG4gICAgICAgIHZhciBmbHlpbmcgPSB0aGlzLnN0YXRlID09PSBTaGVlcC5TdGF0ZS5KdW1wIHx8IHRoaXMubm9kZS55ID4gdGhpcy5ncm91bmRZO1xuICAgICAgICBpZiAoZmx5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCAtPSBkdCAqIHRoaXMuZ3Jhdml0eTtcbiAgICAgICAgICAgIHRoaXMubm9kZS55ICs9IGR0ICogdGhpcy5jdXJyZW50U3BlZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGp1bXA6IGZ1bmN0aW9uIGp1bXAoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5KdW1wO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IHRoaXMuaW5pdEp1bXBTcGVlZDtcbiAgICAgICAgY29uc29sZS5sb2coMTEyMyk7XG4gICAgICAgIC8vIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5qdW1wQXVkaW8pO1xuICAgIH0sXG5cbiAgICBvbkNvbGxpc2lvbkVudGVyOiBmdW5jdGlvbiBvbkNvbGxpc2lvbkVudGVyKG90aGVyLCBzZWxmKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJkYXNmYWRzZmFzZFwiKTtcbiAgICAgICAgb3RoZXIuZ2V0Q29tcG9uZW50KE9ic3RhY2xlKS5nb29zZVZpc2l0KCk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MTA3NnBDK3VKTFA3S3NEVTM4TEEvRCcsICdIdW1hbk1hbmFnZXInKTtcbi8vIHNjcmlwdHMvSHVtYW5NYW5hZ2VyLmpzXG5cbi8qXG4gICAgSHVtYW4gbWFuYWdlclxuXG4gICAgTW9yZSBwcmVjaXNlbHksIGh1YW1hbiBpc24ndCBhbiBcIm9ic3RhY2xlXCIsIHNpbmNlIGl0IGRvZXNuJ3Qga2lsbCB0aGUgZ29vc2VcbiAgICBCdXQgaXQgYmVoYXZlcyBsaWtlIGFuIG9ic3RhY2xlXG4gICAgVGh1cyBIdW1hbiBpbXBsZW1lbnRzIE9ic3RhY2xlIGludGVyZmFjZSBhbmQgSHVtYW5NYW5hZ2VyIGltcGxlbWVudHMgT2JzdGFjbGVNYW5hZ2VyIGludGVyZmFjZVxuKi9cblxudmFyIEh1bWFuID0gcmVxdWlyZSgnSHVtYW4nKTtcbnZhciBPYnN0YWNsZU1hbmFnZXIgPSByZXF1aXJlKFwiT2JzdGFjbGVNYW5hZ2VyXCIpO1xuXG52YXIgSHVtYW5NYW5hZ2VyID0gY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBPYnN0YWNsZU1hbmFnZXIsXG5cbiAgICAvKkltcGxlbWVudGluZyBhYnN0cmFjdCBtZXRob2QgaW4gT2JzdGFjbGVNYW5hZ2VyKi9cbiAgICBzdGFydFNwYXduOiBmdW5jdGlvbiBzdGFydFNwYXduKCkge1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5zcGF3biwgMSk7XG4gICAgfSxcbiAgICBzcGF3bjogZnVuY3Rpb24gc3Bhd24oKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1J1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBodW1hbiA9IG51bGw7XG4gICAgICAgIGlmIChjYy5wb29sLmhhc09iamVjdChIdW1hbikpIHtcbiAgICAgICAgICAgIGh1bWFuID0gY2MucG9vbC5nZXRGcm9tUG9vbChIdW1hbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodW1hbiA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiKS5nZXRDb21wb25lbnQoSHVtYW4pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGF5ZXIuYWRkQ2hpbGQoaHVtYW4ubm9kZSk7XG4gICAgICAgIGh1bWFuLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgaHVtYW4uaW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy5vYnN0YWNsZUxpc3QucHVzaChodW1hbik7XG4gICAgfSxcbiAgICBzdG9wU3Bhd246IGZ1bmN0aW9uIHN0b3BTcGF3bigpIHtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuc3Bhd24pO1xuICAgIH0sXG4gICAgZ2FpblNjb3JlOiBmdW5jdGlvbiBnYWluU2NvcmUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5nYWluU2NvcmUoKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzUwNmMzL1crZjVQSDREOGVBWDNEUWlrJywgJ0h1bWFuJyk7XG4vLyBzY3JpcHRzL0h1bWFuLmpzXG5cbnZhciBPYnN0YWNsZSA9IHJlcXVpcmUoXCJPYnN0YWNsZVwiKTtcblxudmFyIEh1bWFuID0gY2MuQ2xhc3Moe1xuICAgIC8qXG4gICAgICAgIE9ic3RhY2xlIHByb3BlcnRpZXM6XG4gICAgICAgICAgICBzcGVlZFhcbiAgICAgICAgICAgIGluaXRYXG4gICAgICAgICAgICByZXNldFhcbiAgICAgICAgICAgIGluaXRZXG4gICAgKi9cbiAgICBcImV4dGVuZHNcIjogT2JzdGFjbGUsXG5cbiAgICBnb29zZVZpc2l0OiBmdW5jdGlvbiBnb29zZVZpc2l0KCkge1xuICAgICAgICB0aGlzLm1hbmFnZXIuZ2FpblNjb3JlKHRoaXMpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDBkNTBMZ05DaEhlSy9SS1VqdnZXZncnLCAnT2JzdGFjbGVNYW5hZ2VyJyk7XG4vLyBzY3JpcHRzL09ic3RhY2xlTWFuYWdlci5qc1xuXG4vKlxuXHRJbnRlcmZhY2VcblxuXHRBbnkgb2JzdGFjbGUgbWFuYWdlciBzaG91bGQgZXh0ZW5kIHRoaXMgYW5kIG92ZXJ3cml0ZSB0aGUgYWJzdHJhY3QgbWV0aG9kc1xuKi9cblxudmFyIE9ic3RhY2xlTWFuYWdlciA9IGNjLkNsYXNzKHtcblx0XCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuXHRwcm9wZXJ0aWVzOiB7XG5cdFx0cHJlZmFiOiBjYy5QcmVmYWIsIC8vcHJlZmFiIG9mIG9ic3RhY2xlXG5cdFx0bGF5ZXI6IGNjLk5vZGUgfSxcblxuXHQvL2xheWVyIHdoZXJlIG9ic3RhY2xlIGlzIGFkZGVkIGludG9cblxuXHQvKlxuIFx0dGhlc2UgcHJvcGVydGllcyB3b3VsZG4ndCBzaG93IGluIElERSwgYnV0IHRoZXkgZXhpc3RcbiBcdFx0b2JzdGFjbGVMaXN0OiBbXVx0Ly9saXN0IG9mIG9ic3RhY2xlcyB1bmRlciBtYW5hZ2VtZW50XG4gXHRcdGdhbWU6IEdhbWVNYW5hZ2VyXHQvL2dhbWUgbWFuYWdlclxuIFx0XHRpc1J1bm5pbmc6IGJvb2xcbiAqL1xuXHQvL2luaXRpYWxpemUgd2l0aCA8Z2FtZT4gLS0gR2FtZU1hbmFnZXJcblx0Ly9Eb24ndCBmb3JnZXQgdG8gYmluZCB0aGUgY29uY3JldGUgT2JzdGFjbGUgTWFuYWdlciB0byBhIG5vZGVcblx0aW5pdDogZnVuY3Rpb24gaW5pdChnYW1lKSB7XG5cdFx0dGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcblx0XHR0aGlzLmdhbWUgPSBnYW1lO1xuXHRcdHRoaXMub2JzdGFjbGVMaXN0ID0gW107XG5cdH0sXG5cblx0Ly9kZXNwYXduIGFuIG9ic3RhY2xlXG5cdGRlc3Bhd246IGZ1bmN0aW9uIGRlc3Bhd24ob2JzdGFjbGUpIHtcblx0XHRvYnN0YWNsZS5ub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcblx0XHRvYnN0YWNsZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdGNjLnBvb2wucHV0SW5Qb29sKG9ic3RhY2xlKTtcblx0fSxcblxuXHQvL2NhbGxlZCBieSBnYW1lIG1hbmFnZXIgdG8gbm90aWZ5IGdhbWVvdmVyXG5cdGdhbWVPdmVyOiBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcblx0XHR0aGlzLm9ic3RhY2xlTGlzdCA9IFtdO1xuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG5cdFx0dGhpcy5zdG9wU3Bhd24oKTtcblx0fSxcblxuXHQvKlRyZWF0IGFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBhcyBhYnN0cmFjdCBtZXRob2RzKi9cblxuXHQvL3NwYXduIGFuIG9ic3RhY2xlXG5cdHNwYXduOiBmdW5jdGlvbiBzcGF3bigpIHtcblx0XHRjb25zb2xlLmxvZyhcIioqKldBUk5JTkc6IE9ic3RhY2xlTWFuYWdlcjpzcGF3bigpLCBhbiBhYnN0cmFjdCBtZXRob2QgY2FsbGVkXCIpO1xuXHR9LFxuXG5cdC8vc3RhcnQgc3Bhd25pbmdcblx0c3RhcnRTcGF3bjogZnVuY3Rpb24gc3RhcnRTcGF3bigpIHtcblx0XHRjb25zb2xlLmxvZyhcIioqKldBUk5JTkc6IE9ic3RhY2xlTWFuYWdlcjpzdGFydFNwYXduKCksIGFuIGFic3RyYWN0IG1ldGhvZCBjYWxsZWRcIik7XG5cdH0sXG5cblx0c3RvcFNwYXduOiBmdW5jdGlvbiBzdG9wU3Bhd24oKSB7XG5cdFx0Y29uc29sZS5sb2coXCIqKipXQVJOSU5HOiBPYnN0YWNsZU1hbmFnZXI6c3RhcnRTcGF3bigpLCBhbiBhYnN0cmFjdCBtZXRob2QgY2FsbGVkXCIpO1xuXHR9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNmQ2N2ZHSmF5bEc4Sy9BTjhyMDhnOFQnLCAnT2JzdGFjbGUnKTtcbi8vIHNjcmlwdHMvT2JzdGFjbGUuanNcblxuLypcblx0SW50ZXJmYWNlXG5cblx0QW55IG9ic3RhY2xlIHNob3VsZCBleHRlbmQgdGhpcyBhbmQgb3ZlcndyaXRlIHRoZSBhYnN0cmFjdCBtZXRob2RzXG4qL1xuXG52YXIgT2JzdGFjbGUgPSBjYy5DbGFzcyh7XG5cdFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cdHByb3BlcnRpZXM6IHtcblx0XHRzcGVlZFg6IC02MDAsXG5cdFx0aW5pdFg6IDE2MDAsIC8vaW5pdGlhbCB4IGNvb3JkaW5hdGVcblx0XHRyZXNldFg6IC0xNjAwLCAvL3ggY29vcmRpbmF0ZSB0aGF0IHRoZSBvYnN0YWNsZSBpcyByZXNldChyZWN5Y2xlZClcblxuXHRcdGluaXRZOiAwIH0sXG5cblx0Ly9pbml0aWFsIHkgY29vcmRpbmF0ZVxuXG5cdC8qXG4gXHR0aGVzZSBwcm9wZXJ0aWVzIHdvdWxkbid0IHNob3cgaW4gSURFLCBidXQgdXNlIHRoZW0gYXMgbmVlZGVkIGluIHNjcmlwdFxuIFx0XHRtYW5hZ2VyOiBPYnN0YWNsZU1hbmFnZXJcbiAqL1xuXHRvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblx0XHR0aGlzLm5vZGUueCA9IHRoaXMuaW5pdFg7XG5cdFx0dGhpcy5ub2RlLnkgPSB0aGlzLmluaXRZO1xuXHR9LFxuXG5cdHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cdFx0aWYgKCF0aGlzLm1hbmFnZXIuaXNSdW5uaW5nKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5ub2RlLnggKz0gdGhpcy5zcGVlZFggKiBkdDtcblx0XHRpZiAodGhpcy5ub2RlLnggPCB0aGlzLnJlc2V0WCkge1xuXHRcdFx0dGhpcy5yZXNldCgpO1xuXHRcdH1cblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbiBpbml0KG1hbmFnZXIpIHtcblx0XHR0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXHR9LFxuXG5cdHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcblx0XHR0aGlzLm5vZGUueCA9IHRoaXMuaW5pdFg7XG5cdFx0dGhpcy5ub2RlLnkgPSB0aGlzLmluaXRZO1xuXHRcdHRoaXMubWFuYWdlci5kZXNwYXduKHRoaXMpO1xuXHR9LFxuXG5cdC8qVHJlYXQgdGhlIGZvbGxvd2luZyBhcyBhYnN0cmFjdCBtZXRob2RzKi9cblxuXHQvKlxuIFx0LS0tVmlzaXRvciBwYXR0ZXJuLS0tXG4gXHRDYWxsZWQgYnkgR29vc2Ugd2hlbiBnb29zZSBjb2xsaWRlIHdpdGggb2JzdGFjbGVcbiBcdFVwIHRvIHRoZSBjb25jcmV0ZSBjbGFzcyB0byBpbXBsZW1lbnQgKGRlY2lkZSB3aGF0IHRvIGRvKVxuICovXG5cdGdvb3NlVmlzaXQ6IGZ1bmN0aW9uIGdvb3NlVmlzaXQoKSB7XG5cdFx0Y29uc29sZS5sb2coXCIqKldBUk5JTkc6IE9ic3RhY2xlOmdvb3NlVmlzaXQoKSwgYW4gYWJzdHJhY3QgbWV0aG9kIGNhbGxlZFwiKTtcblx0fVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkzMGQ1THNoclpCa2JzSzBiMDVsaTdSJywgJ1Njcm9sbGVyJyk7XG4vLyBzY3JpcHRzL1Njcm9sbGVyLmpzXG5cbi8qXG5cdFNjcm9sbCBiYWNrZ3JvdW5kIGFuZCByZXNldCBhdCBjZXJ0YWluIHBvaW50LCBzbyB0aGF0IGl0IGxvb2tzIGxpa2UgYW4gaW5maW5hdGUgbG9vcGluZyBiYWNrZ3JvdW5cbiovXG5cbnZhciBTY3JvbGxlciA9IGNjLkNsYXNzKHtcblx0XCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblx0cHJvcGVydGllczoge1xuXHRcdHNwZWVkOiAwLCAvL3NwZWVkIG9mIHNjcm9sbGluZ1xuXHRcdHJlc2V0WDogMCB9LFxuXG5cdC8vcmVzZXQgcG9pbnRcblx0dXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblx0XHR0aGlzLm5vZGUueCArPSB0aGlzLnNwZWVkICogZHQ7XG5cdFx0aWYgKHRoaXMubm9kZS54IDw9IHRoaXMucmVzZXRYKSB7XG5cdFx0XHR0aGlzLm5vZGUueCAtPSB0aGlzLnJlc2V0WDtcblx0XHR9XG5cdH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
