const Human = require('Human');
const ObstacleManager = require("ObstacleManager");

var HumanManager = cc.Class({
    extends: ObstacleManager,

    init: function (game) {
        this.game = game;
        this.humanList = [];
        this.isRunning = false;
    },
    startSpawn() {
        this.isRunning = true;
        this.schedule(this.spawn, 1);
    },
    spawn() {
        let human = null;
        if (cc.pool.hasObject(Human)) {
            human = cc.pool.getFromPool(Human);
        } else {
            human = cc.instantiate(this.prefab).getComponent(Human);
        }
        this.layer.addChild(human.node);
        human.node.active = true;
        human.init(this);
        this.humanList.push(human);
    },
    despawn(human) {
        human.node.removeFromParent();
        human.node.active = false;
        cc.pool.putInPool(human);
    },
    reset () {
        // this.unschedule(this.spawnHuman);
        this.humanList = [];
        this.isRunning = false;
    },
    gainScore: function() {
        this.game.gainScore();
    }
});