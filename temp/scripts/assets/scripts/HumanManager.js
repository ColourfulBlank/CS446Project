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