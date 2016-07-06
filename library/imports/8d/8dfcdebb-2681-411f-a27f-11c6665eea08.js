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