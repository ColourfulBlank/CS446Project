const Human = require('Human');
const ObstacleManager = require("ObstacleManager");

var HumanManager = cc.Class({
    extends: ObstacleManager,


    startSpawn() {
        this.isRunning = true;
        this.schedule(this.spawn, 1);
    },
    spawn() {
        if (!this.isRunning) {
            return;
        }

        let human = null;
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
    stopSpawn() {
        this.unschedule(this.spawn);
    },
    gainScore: function() {
        this.game.gainScore();
    }
});