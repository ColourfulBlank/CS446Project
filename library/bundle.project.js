require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CarManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '06896Hr5EhG963y1B6iVITX', 'CarManager');
// scripts/CarManager.js

var Car = require('Car');
var ObstacleManager = require("ObstacleManager");

var CarManager = cc.Class({
	"extends": ObstacleManager,

	/*Implements abstract methods*/

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

    /*Implements abstract methods*/

    /*
        ---VIsitor pattern---
    */
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
        managers: { //list of obstacle managers
            'default': [],
            type: [ObstacleManager]
        },
        gameOverMenu: cc.Node,
        scoreText: cc.Label,
        gameBgAudio: {
            'default': null,
            url: cc.AudioClip
        },

        gameOverAudio: {
            'default': null,
            url: cc.AudioClip
        }
    },
    onLoad: function onLoad() {
        this.gameState = GameState.Menu;
        this.score = 0;
        this.scoreText.string = this.score;
        this.gameOverMenu.active = false;
        this.goose.init(this);

        //init all obstacle managers
        for (var i = 0; i < this.managers.length; i++) {
            var manager = this.managers[i];
            manager.init(this);
        }

        //enable collision detection
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;

        this.start();
    },
    start: function start() {
        this.gameState = GameState.Run;
        this.score = 0;

        //notify all obstacle managers to start spawning
        for (var i = 0; i < this.managers.length; i++) {
            var manager = this.managers[i];
            manager.startSpawn();
        }

        this.goose.startRun();
    },
    gameOver: function gameOver() {
        this.goose.state = Goose.State.Dead;
        this.goose.enableInput(false);

        //tell all obstacle manager to stop
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
        btn_play: cc.Button, //restart button
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

//stae of goose
var State = cc.Enum({
    None: -1,
    Run: -1,
    Jump: -1,
    Drop: -1,
    DropEnd: -1,
    Dead: -1
});

var Goose = cc.Class({
    "extends": cc.Component,
    properties: {
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

            /*
                state setter, when state is set (changed), corresponding animation clip will be played
            */
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

    jump: function jump() {
        this.state = State.Jump;
        this.currentSpeed = this.initJumpSpeed;
        // cc.audioEngine.playEffect(this.jumpAudio);
    },

    /*
        collision detection
        when collide, call obstacle's "gooseVisit" -- part of Visitor pattern
    */
    onCollisionEnter: function onCollisionEnter(other, self) {
        other.getComponent(Obstacle).gooseVisit();
    },

    _updateState: function _updateState(dt) {
        switch (this.state) {
            case Goose.State.Jump:
                if (this.currentSpeed < 0) {
                    this.state = State.Drop;
                }
                break;
            case Goose.State.Drop:
                if (this.node.y < this.groundY) {
                    this.node.y = this.groundY;
                    this.state = State.DropEnd;
                }
                break;
        }
    },

    _updatePosition: function _updatePosition(dt) {
        var flying = this.state === Goose.State.Jump || this.node.y > this.groundY;
        if (flying) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
            if (this.node.y > this.maxY) {
                this.node.y = maxY;
            }
        }
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

/*
    Human isn't actually an obstacle, but it behaves like one

    Just alter the behavior with Visitor pattern -- gooseVisit
*/

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

    /*Implementing abstract method in interface*/

    /*
        ---Visitor pattern---
        called by goose when collide
    */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdHMvQ2FyTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL0Nhci5qcyIsImFzc2V0cy9zY3JpcHRzL0dhbWVNYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvR2FtZU92ZXJNZW51LmpzIiwiYXNzZXRzL3NjcmlwdHMvR29vc2UuanMiLCJhc3NldHMvc2NyaXB0cy9IdW1hbk1hbmFnZXIuanMiLCJhc3NldHMvc2NyaXB0cy9IdW1hbi5qcyIsImFzc2V0cy9zY3JpcHRzL09ic3RhY2xlTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL09ic3RhY2xlLmpzIiwiYXNzZXRzL3NjcmlwdHMvU2Nyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwNjg5NkhyNUVoRzk2M3kxQjZpVklUWCcsICdDYXJNYW5hZ2VyJyk7XG4vLyBzY3JpcHRzL0Nhck1hbmFnZXIuanNcblxudmFyIENhciA9IHJlcXVpcmUoJ0NhcicpO1xudmFyIE9ic3RhY2xlTWFuYWdlciA9IHJlcXVpcmUoXCJPYnN0YWNsZU1hbmFnZXJcIik7XG5cbnZhciBDYXJNYW5hZ2VyID0gY2MuQ2xhc3Moe1xuXHRcImV4dGVuZHNcIjogT2JzdGFjbGVNYW5hZ2VyLFxuXG5cdC8qSW1wbGVtZW50cyBhYnN0cmFjdCBtZXRob2RzKi9cblxuXHRzcGF3bjogZnVuY3Rpb24gc3Bhd24oKSB7XG5cdFx0aWYgKCF0aGlzLmlzUnVubmluZykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgY2FyID0gbnVsbDtcblx0XHRpZiAoY2MucG9vbC5oYXNPYmplY3QoQ2FyKSkge1xuXHRcdFx0Y2FyID0gY2MucG9vbC5nZXRGcm9tUG9vbChDYXIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjYXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnByZWZhYikuZ2V0Q29tcG9uZW50KENhcik7XG5cdFx0fVxuXHRcdHRoaXMubGF5ZXIuYWRkQ2hpbGQoY2FyLm5vZGUpO1xuXHRcdGNhci5ub2RlLmFjdGl2ZSA9IHRydWU7XG5cdFx0Y2FyLmluaXQodGhpcyk7XG5cdFx0dGhpcy5vYnN0YWNsZUxpc3QucHVzaChjYXIpO1xuXHR9LFxuXG5cdHN0YXJ0U3Bhd246IGZ1bmN0aW9uIHN0YXJ0U3Bhd24oKSB7XG5cdFx0dGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xuXHRcdHRoaXMuc2NoZWR1bGUodGhpcy5zcGF3biwgMyk7XG5cdH0sXG5cblx0c3RvcFNwYXduOiBmdW5jdGlvbiBzdG9wU3Bhd24oKSB7XG5cdFx0dGhpcy51bnNjaGVkdWxlKHRoaXMuc3Bhd24pO1xuXHR9LFxuXG5cdGNhckhpdDogZnVuY3Rpb24gY2FySGl0KGNhcikge1xuXHRcdHRoaXMuZ2FtZS5nYW1lT3ZlcigpO1xuXHR9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2JkNDVhQ25saDlCVTRRR1c1Q1M3SkdrJywgJ0NhcicpO1xuLy8gc2NyaXB0cy9DYXIuanNcblxudmFyIE9ic3RhY2xlID0gcmVxdWlyZShcIk9ic3RhY2xlXCIpO1xuXG52YXIgQ2FyID0gY2MuQ2xhc3Moe1xuICAgIC8qXG4gICAgXHRPYnN0YWNsZSBwcm9wZXJ0aWVzOlxuICAgIHNwZWVkWFxuICAgIGluaXRYXG4gICAgcmVzZXRYXG4gICAgaW5pdFlcbiAgICAqL1xuICAgIFwiZXh0ZW5kc1wiOiBPYnN0YWNsZSxcblxuICAgIC8qSW1wbGVtZW50cyBhYnN0cmFjdCBtZXRob2RzKi9cblxuICAgIC8qXG4gICAgICAgIC0tLVZJc2l0b3IgcGF0dGVybi0tLVxuICAgICovXG4gICAgZ29vc2VWaXNpdDogZnVuY3Rpb24gZ29vc2VWaXNpdCgpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLmNhckhpdCh0aGlzKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOGRmY2Q2N0pvRkJINkovRWNabVh1b0knLCAnR2FtZU1hbmFnZXInKTtcbi8vIHNjcmlwdHMvR2FtZU1hbmFnZXIuanNcblxudmFyIEdvb3NlID0gcmVxdWlyZSgnR29vc2UnKTtcbnZhciBPYnN0YWNsZU1hbmFnZXIgPSByZXF1aXJlKCdPYnN0YWNsZU1hbmFnZXInKTtcblxudmFyIEdhbWVTdGF0ZSA9IGNjLkVudW0oe1xuICAgIE1lbnU6IC0xLFxuICAgIFJ1bjogLTEsXG4gICAgT3ZlcjogLTFcbn0pO1xuXG52YXIgR2FtZU1hbmFnZXIgPSBjYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnb29zZTogR29vc2UsXG4gICAgICAgIG1hbmFnZXJzOiB7IC8vbGlzdCBvZiBvYnN0YWNsZSBtYW5hZ2Vyc1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtPYnN0YWNsZU1hbmFnZXJdXG4gICAgICAgIH0sXG4gICAgICAgIGdhbWVPdmVyTWVudTogY2MuTm9kZSxcbiAgICAgICAgc2NvcmVUZXh0OiBjYy5MYWJlbCxcbiAgICAgICAgZ2FtZUJnQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2FtZU92ZXJBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLk1lbnU7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLnNjb3JlVGV4dC5zdHJpbmcgPSB0aGlzLnNjb3JlO1xuICAgICAgICB0aGlzLmdhbWVPdmVyTWVudS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nb29zZS5pbml0KHRoaXMpO1xuXG4gICAgICAgIC8vaW5pdCBhbGwgb2JzdGFjbGUgbWFuYWdlcnNcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm1hbmFnZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbWFuYWdlciA9IHRoaXMubWFuYWdlcnNbaV07XG4gICAgICAgICAgICBtYW5hZ2VyLmluaXQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2VuYWJsZSBjb2xsaXNpb24gZGV0ZWN0aW9uXG4gICAgICAgIHZhciBjb2xsaXNpb25NYW5hZ2VyID0gY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpO1xuICAgICAgICBjb2xsaXNpb25NYW5hZ2VyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBHYW1lU3RhdGUuUnVuO1xuICAgICAgICB0aGlzLnNjb3JlID0gMDtcblxuICAgICAgICAvL25vdGlmeSBhbGwgb2JzdGFjbGUgbWFuYWdlcnMgdG8gc3RhcnQgc3Bhd25pbmdcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm1hbmFnZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbWFuYWdlciA9IHRoaXMubWFuYWdlcnNbaV07XG4gICAgICAgICAgICBtYW5hZ2VyLnN0YXJ0U3Bhd24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ29vc2Uuc3RhcnRSdW4oKTtcbiAgICB9LFxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICAgICAgdGhpcy5nb29zZS5zdGF0ZSA9IEdvb3NlLlN0YXRlLkRlYWQ7XG4gICAgICAgIHRoaXMuZ29vc2UuZW5hYmxlSW5wdXQoZmFsc2UpO1xuXG4gICAgICAgIC8vdGVsbCBhbGwgb2JzdGFjbGUgbWFuYWdlciB0byBzdG9wXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tYW5hZ2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1hbmFnZXIgPSB0aGlzLm1hbmFnZXJzW2ldO1xuICAgICAgICAgICAgbWFuYWdlci5nYW1lT3ZlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBHYW1lU3RhdGUuT3ZlcjtcbiAgICAgICAgdGhpcy5nYW1lT3Zlck1lbnUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lT3Zlck1lbnUuZ2V0Q29tcG9uZW50KCdHYW1lT3Zlck1lbnUnKS5zY29yZS5zdHJpbmcgPSB0aGlzLnNjb3JlO1xuICAgIH0sXG4gICAgZ2FpblNjb3JlOiBmdW5jdGlvbiBnYWluU2NvcmUoKSB7XG4gICAgICAgIHRoaXMuc2NvcmUrKztcbiAgICAgICAgdGhpcy5zY29yZVRleHQuc3RyaW5nID0gdGhpcy5zY29yZTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQ2NzhlRjEzcXRDSEpOQ3NCMERpYmpNJywgJ0dhbWVPdmVyTWVudScpO1xuLy8gc2NyaXB0cy9HYW1lT3Zlck1lbnUuanNcblxudmFyIEdhbWVPdmVyTWVudSA9IGNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJ0bl9wbGF5OiBjYy5CdXR0b24sIC8vcmVzdGFydCBidXR0b25cbiAgICAgICAgc2NvcmU6IGNjLkxhYmVsXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge30sXG4gICAgcmVzdGFydDogZnVuY3Rpb24gcmVzdGFydCgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdHYW1lJyk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyMWY4MVJnenJCSU1MNXozMFFSbDc1RycsICdHb29zZScpO1xuLy8gc2NyaXB0cy9Hb29zZS5qc1xuXG52YXIgT2JzdGFjbGUgPSByZXF1aXJlKFwiT2JzdGFjbGVcIik7XG5cbi8vc3RhZSBvZiBnb29zZVxudmFyIFN0YXRlID0gY2MuRW51bSh7XG4gICAgTm9uZTogLTEsXG4gICAgUnVuOiAtMSxcbiAgICBKdW1wOiAtMSxcbiAgICBEcm9wOiAtMSxcbiAgICBEcm9wRW5kOiAtMSxcbiAgICBEZWFkOiAtMVxufSk7XG5cbnZhciBHb29zZSA9IGNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbWF4WTogMCxcbiAgICAgICAgZ3JvdW5kWTogMCxcbiAgICAgICAgZ3Jhdml0eTogMCxcbiAgICAgICAgaW5pdEp1bXBTcGVlZDogMCxcbiAgICAgICAgX3N0YXRlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogU3RhdGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IFN0YXRlLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgc3RhdGUgc2V0dGVyLCB3aGVuIHN0YXRlIGlzIHNldCAoY2hhbmdlZCksIGNvcnJlc3BvbmRpbmcgYW5pbWF0aW9uIGNsaXAgd2lsbCBiZSBwbGF5ZWRcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlICE9PSBTdGF0ZS5Ob25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbU5hbWUgPSBTdGF0ZVt0aGlzLl9zdGF0ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW0uc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltLnBsYXkoYW5pbU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IFN0YXRlXG4gICAgICAgIH0sXG4gICAgICAgIGp1bXBBdWRpbzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFN0YXRlOiBTdGF0ZVxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5hbmltID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSAwO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnB1dCgpO1xuXG4gICAgICAgIHRoaXMuZ3JvdW5kWSA9IHRoaXMubm9kZS55O1xuICAgIH0sXG5cbiAgICBzdGFydFJ1bjogZnVuY3Rpb24gc3RhcnRSdW4oKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5SdW47XG4gICAgICAgIHRoaXMuZW5hYmxlSW5wdXQodHJ1ZSk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVySW5wdXQ6IGZ1bmN0aW9uIHJlZ2lzdGVySW5wdXQoKSB7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogKGZ1bmN0aW9uIChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuanVtcCgpO1xuICAgICAgICAgICAgfSkuYmluZCh0aGlzKVxuICAgICAgICB9LCB0aGlzLm5vZGUpO1xuICAgICAgICAvLyB0b3VjaCBpbnB1dFxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogKGZ1bmN0aW9uICh0b3VjaCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmp1bXAoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pLmJpbmQodGhpcylcbiAgICAgICAgfSwgdGhpcy5ub2RlKTtcbiAgICB9LFxuXG4gICAgZW5hYmxlSW5wdXQ6IGZ1bmN0aW9uIGVuYWJsZUlucHV0KGVuYWJsZSkge1xuICAgICAgICBpZiAoZW5hYmxlKSB7XG4gICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIucmVzdW1lVGFyZ2V0KHRoaXMubm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIucGF1c2VUYXJnZXQodGhpcy5ub2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gU3RhdGUuTm9uZSB8fCB0aGlzLnN0YXRlID09PSBTdGF0ZS5EZWFkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoZHQpO1xuICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihkdCk7XG4gICAgfSxcblxuICAgIGp1bXA6IGZ1bmN0aW9uIGp1bXAoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5KdW1wO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IHRoaXMuaW5pdEp1bXBTcGVlZDtcbiAgICAgICAgLy8gY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmp1bXBBdWRpbyk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIGNvbGxpc2lvbiBkZXRlY3Rpb25cbiAgICAgICAgd2hlbiBjb2xsaWRlLCBjYWxsIG9ic3RhY2xlJ3MgXCJnb29zZVZpc2l0XCIgLS0gcGFydCBvZiBWaXNpdG9yIHBhdHRlcm5cbiAgICAqL1xuICAgIG9uQ29sbGlzaW9uRW50ZXI6IGZ1bmN0aW9uIG9uQ29sbGlzaW9uRW50ZXIob3RoZXIsIHNlbGYpIHtcbiAgICAgICAgb3RoZXIuZ2V0Q29tcG9uZW50KE9ic3RhY2xlKS5nb29zZVZpc2l0KCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVTdGF0ZTogZnVuY3Rpb24gX3VwZGF0ZVN0YXRlKGR0KSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBHb29zZS5TdGF0ZS5KdW1wOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcGVlZCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFN0YXRlLkRyb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHb29zZS5TdGF0ZS5Ecm9wOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUueSA8IHRoaXMuZ3JvdW5kWSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuZ3JvdW5kWTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFN0YXRlLkRyb3BFbmQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gX3VwZGF0ZVBvc2l0aW9uKGR0KSB7XG4gICAgICAgIHZhciBmbHlpbmcgPSB0aGlzLnN0YXRlID09PSBHb29zZS5TdGF0ZS5KdW1wIHx8IHRoaXMubm9kZS55ID4gdGhpcy5ncm91bmRZO1xuICAgICAgICBpZiAoZmx5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCAtPSBkdCAqIHRoaXMuZ3Jhdml0eTtcbiAgICAgICAgICAgIHRoaXMubm9kZS55ICs9IGR0ICogdGhpcy5jdXJyZW50U3BlZWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnkgPiB0aGlzLm1heFkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IG1heFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDEwNzZwQyt1SkxQN0tzRFUzOExBL0QnLCAnSHVtYW5NYW5hZ2VyJyk7XG4vLyBzY3JpcHRzL0h1bWFuTWFuYWdlci5qc1xuXG4vKlxuICAgIEh1bWFuIG1hbmFnZXJcblxuICAgIE1vcmUgcHJlY2lzZWx5LCBodWFtYW4gaXNuJ3QgYW4gXCJvYnN0YWNsZVwiLCBzaW5jZSBpdCBkb2Vzbid0IGtpbGwgdGhlIGdvb3NlXG4gICAgQnV0IGl0IGJlaGF2ZXMgbGlrZSBhbiBvYnN0YWNsZVxuICAgIFRodXMgSHVtYW4gaW1wbGVtZW50cyBPYnN0YWNsZSBpbnRlcmZhY2UgYW5kIEh1bWFuTWFuYWdlciBpbXBsZW1lbnRzIE9ic3RhY2xlTWFuYWdlciBpbnRlcmZhY2VcbiovXG5cbnZhciBIdW1hbiA9IHJlcXVpcmUoJ0h1bWFuJyk7XG52YXIgT2JzdGFjbGVNYW5hZ2VyID0gcmVxdWlyZShcIk9ic3RhY2xlTWFuYWdlclwiKTtcblxudmFyIEh1bWFuTWFuYWdlciA9IGNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogT2JzdGFjbGVNYW5hZ2VyLFxuXG4gICAgLypJbXBsZW1lbnRpbmcgYWJzdHJhY3QgbWV0aG9kIGluIE9ic3RhY2xlTWFuYWdlciovXG5cbiAgICBzdGFydFNwYXduOiBmdW5jdGlvbiBzdGFydFNwYXduKCkge1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5zcGF3biwgMSk7XG4gICAgfSxcblxuICAgIHNwYXduOiBmdW5jdGlvbiBzcGF3bigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGh1bWFuID0gbnVsbDtcbiAgICAgICAgaWYgKGNjLnBvb2wuaGFzT2JqZWN0KEh1bWFuKSkge1xuICAgICAgICAgICAgaHVtYW4gPSBjYy5wb29sLmdldEZyb21Qb29sKEh1bWFuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGh1bWFuID0gY2MuaW5zdGFudGlhdGUodGhpcy5wcmVmYWIpLmdldENvbXBvbmVudChIdW1hbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXllci5hZGRDaGlsZChodW1hbi5ub2RlKTtcbiAgICAgICAgaHVtYW4ubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBodW1hbi5pbml0KHRoaXMpO1xuICAgICAgICB0aGlzLm9ic3RhY2xlTGlzdC5wdXNoKGh1bWFuKTtcbiAgICB9LFxuXG4gICAgc3RvcFNwYXduOiBmdW5jdGlvbiBzdG9wU3Bhd24oKSB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLnNwYXduKTtcbiAgICB9LFxuXG4gICAgZ2FpblNjb3JlOiBmdW5jdGlvbiBnYWluU2NvcmUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5nYWluU2NvcmUoKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzUwNmMzL1crZjVQSDREOGVBWDNEUWlrJywgJ0h1bWFuJyk7XG4vLyBzY3JpcHRzL0h1bWFuLmpzXG5cbi8qXG4gICAgSHVtYW4gaXNuJ3QgYWN0dWFsbHkgYW4gb2JzdGFjbGUsIGJ1dCBpdCBiZWhhdmVzIGxpa2Ugb25lXG5cbiAgICBKdXN0IGFsdGVyIHRoZSBiZWhhdmlvciB3aXRoIFZpc2l0b3IgcGF0dGVybiAtLSBnb29zZVZpc2l0XG4qL1xuXG52YXIgT2JzdGFjbGUgPSByZXF1aXJlKFwiT2JzdGFjbGVcIik7XG5cbnZhciBIdW1hbiA9IGNjLkNsYXNzKHtcbiAgICAvKlxuICAgICAgICBPYnN0YWNsZSBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgc3BlZWRYXG4gICAgICAgICAgICBpbml0WFxuICAgICAgICAgICAgcmVzZXRYXG4gICAgICAgICAgICBpbml0WVxuICAgICovXG4gICAgXCJleHRlbmRzXCI6IE9ic3RhY2xlLFxuXG4gICAgLypJbXBsZW1lbnRpbmcgYWJzdHJhY3QgbWV0aG9kIGluIGludGVyZmFjZSovXG5cbiAgICAvKlxuICAgICAgICAtLS1WaXNpdG9yIHBhdHRlcm4tLS1cbiAgICAgICAgY2FsbGVkIGJ5IGdvb3NlIHdoZW4gY29sbGlkZVxuICAgICovXG4gICAgZ29vc2VWaXNpdDogZnVuY3Rpb24gZ29vc2VWaXNpdCgpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLmdhaW5TY29yZSh0aGlzKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQwZDUwTGdOQ2hIZUsvUktVanZ2V2Z3JywgJ09ic3RhY2xlTWFuYWdlcicpO1xuLy8gc2NyaXB0cy9PYnN0YWNsZU1hbmFnZXIuanNcblxuLypcblx0SW50ZXJmYWNlXG5cblx0QW55IG9ic3RhY2xlIG1hbmFnZXIgc2hvdWxkIGV4dGVuZCB0aGlzIGFuZCBvdmVyd3JpdGUgdGhlIGFic3RyYWN0IG1ldGhvZHNcbiovXG5cbnZhciBPYnN0YWNsZU1hbmFnZXIgPSBjYy5DbGFzcyh7XG5cdFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cblx0cHJvcGVydGllczoge1xuXHRcdHByZWZhYjogY2MuUHJlZmFiLCAvL3ByZWZhYiBvZiBvYnN0YWNsZVxuXHRcdGxheWVyOiBjYy5Ob2RlIH0sXG5cblx0Ly9sYXllciB3aGVyZSBvYnN0YWNsZSBpcyBhZGRlZCBpbnRvXG5cblx0LypcbiBcdHRoZXNlIHByb3BlcnRpZXMgd291bGRuJ3Qgc2hvdyBpbiBJREUsIGJ1dCB0aGV5IGV4aXN0XG4gXHRcdG9ic3RhY2xlTGlzdDogW11cdC8vbGlzdCBvZiBvYnN0YWNsZXMgdW5kZXIgbWFuYWdlbWVudFxuIFx0XHRnYW1lOiBHYW1lTWFuYWdlclx0Ly9nYW1lIG1hbmFnZXJcbiBcdFx0aXNSdW5uaW5nOiBib29sXG4gKi9cblx0Ly9pbml0aWFsaXplIHdpdGggPGdhbWU+IC0tIEdhbWVNYW5hZ2VyXG5cdC8vRG9uJ3QgZm9yZ2V0IHRvIGJpbmQgdGhlIGNvbmNyZXRlIE9ic3RhY2xlIE1hbmFnZXIgdG8gYSBub2RlXG5cdGluaXQ6IGZ1bmN0aW9uIGluaXQoZ2FtZSkge1xuXHRcdHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG5cdFx0dGhpcy5nYW1lID0gZ2FtZTtcblx0XHR0aGlzLm9ic3RhY2xlTGlzdCA9IFtdO1xuXHR9LFxuXG5cdC8vZGVzcGF3biBhbiBvYnN0YWNsZVxuXHRkZXNwYXduOiBmdW5jdGlvbiBkZXNwYXduKG9ic3RhY2xlKSB7XG5cdFx0b2JzdGFjbGUubm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG5cdFx0b2JzdGFjbGUubm9kZS5hY3RpdmUgPSBmYWxzZTtcblx0XHRjYy5wb29sLnB1dEluUG9vbChvYnN0YWNsZSk7XG5cdH0sXG5cblx0Ly9jYWxsZWQgYnkgZ2FtZSBtYW5hZ2VyIHRvIG5vdGlmeSBnYW1lb3ZlclxuXHRnYW1lT3ZlcjogZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG5cdFx0dGhpcy5vYnN0YWNsZUxpc3QgPSBbXTtcblx0XHR0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xuXHRcdHRoaXMuc3RvcFNwYXduKCk7XG5cdH0sXG5cblx0LypUcmVhdCBhbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgYXMgYWJzdHJhY3QgbWV0aG9kcyovXG5cblx0Ly9zcGF3biBhbiBvYnN0YWNsZVxuXHRzcGF3bjogZnVuY3Rpb24gc3Bhd24oKSB7XG5cdFx0Y29uc29sZS5sb2coXCIqKipXQVJOSU5HOiBPYnN0YWNsZU1hbmFnZXI6c3Bhd24oKSwgYW4gYWJzdHJhY3QgbWV0aG9kIGNhbGxlZFwiKTtcblx0fSxcblxuXHQvL3N0YXJ0IHNwYXduaW5nXG5cdHN0YXJ0U3Bhd246IGZ1bmN0aW9uIHN0YXJ0U3Bhd24oKSB7XG5cdFx0Y29uc29sZS5sb2coXCIqKipXQVJOSU5HOiBPYnN0YWNsZU1hbmFnZXI6c3RhcnRTcGF3bigpLCBhbiBhYnN0cmFjdCBtZXRob2QgY2FsbGVkXCIpO1xuXHR9LFxuXG5cdHN0b3BTcGF3bjogZnVuY3Rpb24gc3RvcFNwYXduKCkge1xuXHRcdGNvbnNvbGUubG9nKFwiKioqV0FSTklORzogT2JzdGFjbGVNYW5hZ2VyOnN0YXJ0U3Bhd24oKSwgYW4gYWJzdHJhY3QgbWV0aG9kIGNhbGxlZFwiKTtcblx0fVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZkNjdmR0pheWxHOEsvQU44cjA4ZzhUJywgJ09ic3RhY2xlJyk7XG4vLyBzY3JpcHRzL09ic3RhY2xlLmpzXG5cbi8qXG5cdEludGVyZmFjZVxuXG5cdEFueSBvYnN0YWNsZSBzaG91bGQgZXh0ZW5kIHRoaXMgYW5kIG92ZXJ3cml0ZSB0aGUgYWJzdHJhY3QgbWV0aG9kc1xuKi9cblxudmFyIE9ic3RhY2xlID0gY2MuQ2xhc3Moe1xuXHRcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXHRwcm9wZXJ0aWVzOiB7XG5cdFx0c3BlZWRYOiAtNjAwLFxuXHRcdGluaXRYOiAxNjAwLCAvL2luaXRpYWwgeCBjb29yZGluYXRlXG5cdFx0cmVzZXRYOiAtMTYwMCwgLy94IGNvb3JkaW5hdGUgdGhhdCB0aGUgb2JzdGFjbGUgaXMgcmVzZXQocmVjeWNsZWQpXG5cblx0XHRpbml0WTogMCB9LFxuXG5cdC8vaW5pdGlhbCB5IGNvb3JkaW5hdGVcblxuXHQvKlxuIFx0dGhlc2UgcHJvcGVydGllcyB3b3VsZG4ndCBzaG93IGluIElERSwgYnV0IHVzZSB0aGVtIGFzIG5lZWRlZCBpbiBzY3JpcHRcbiBcdFx0bWFuYWdlcjogT2JzdGFjbGVNYW5hZ2VyXG4gKi9cblx0b25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cdFx0dGhpcy5ub2RlLnggPSB0aGlzLmluaXRYO1xuXHRcdHRoaXMubm9kZS55ID0gdGhpcy5pbml0WTtcblx0fSxcblxuXHR1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXHRcdGlmICghdGhpcy5tYW5hZ2VyLmlzUnVubmluZykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMubm9kZS54ICs9IHRoaXMuc3BlZWRYICogZHQ7XG5cdFx0aWYgKHRoaXMubm9kZS54IDwgdGhpcy5yZXNldFgpIHtcblx0XHRcdHRoaXMucmVzZXQoKTtcblx0XHR9XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24gaW5pdChtYW5hZ2VyKSB7XG5cdFx0dGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcblx0fSxcblxuXHRyZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG5cdFx0dGhpcy5ub2RlLnggPSB0aGlzLmluaXRYO1xuXHRcdHRoaXMubm9kZS55ID0gdGhpcy5pbml0WTtcblx0XHR0aGlzLm1hbmFnZXIuZGVzcGF3bih0aGlzKTtcblx0fSxcblxuXHQvKlRyZWF0IHRoZSBmb2xsb3dpbmcgYXMgYWJzdHJhY3QgbWV0aG9kcyovXG5cblx0LypcbiBcdC0tLVZpc2l0b3IgcGF0dGVybi0tLVxuIFx0Q2FsbGVkIGJ5IEdvb3NlIHdoZW4gZ29vc2UgY29sbGlkZSB3aXRoIG9ic3RhY2xlXG4gXHRVcCB0byB0aGUgY29uY3JldGUgY2xhc3MgdG8gaW1wbGVtZW50IChkZWNpZGUgd2hhdCB0byBkbylcbiAqL1xuXHRnb29zZVZpc2l0OiBmdW5jdGlvbiBnb29zZVZpc2l0KCkge1xuXHRcdGNvbnNvbGUubG9nKFwiKipXQVJOSU5HOiBPYnN0YWNsZTpnb29zZVZpc2l0KCksIGFuIGFic3RyYWN0IG1ldGhvZCBjYWxsZWRcIik7XG5cdH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5MzBkNUxzaHJaQmtic0swYjA1bGk3UicsICdTY3JvbGxlcicpO1xuLy8gc2NyaXB0cy9TY3JvbGxlci5qc1xuXG4vKlxuXHRTY3JvbGwgYmFja2dyb3VuZCBhbmQgcmVzZXQgYXQgY2VydGFpbiBwb2ludCwgc28gdGhhdCBpdCBsb29rcyBsaWtlIGFuIGluZmluYXRlIGxvb3BpbmcgYmFja2dyb3VuXG4qL1xuXG52YXIgU2Nyb2xsZXIgPSBjYy5DbGFzcyh7XG5cdFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cdHByb3BlcnRpZXM6IHtcblx0XHRzcGVlZDogMCwgLy9zcGVlZCBvZiBzY3JvbGxpbmdcblx0XHRyZXNldFg6IDAgfSxcblxuXHQvL3Jlc2V0IHBvaW50XG5cdHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cdFx0dGhpcy5ub2RlLnggKz0gdGhpcy5zcGVlZCAqIGR0O1xuXHRcdGlmICh0aGlzLm5vZGUueCA8PSB0aGlzLnJlc2V0WCkge1xuXHRcdFx0dGhpcy5ub2RlLnggLT0gdGhpcy5yZXNldFg7XG5cdFx0fVxuXHR9XG59KTtcblxuY2MuX1JGcG9wKCk7Il19
