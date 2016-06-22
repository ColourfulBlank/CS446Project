const Human = require('Human');

var HumanManager = cc.Class({
    extends: cc.Component,
    //-- 属性
    properties: {
        humanPrefab: cc.Prefab,
        humanLayer: cc.Node,
        initHumanX: 0,
        //-- 创建Human需要的时间
        spawnInterval: 0
    },
    //-- 初始化
    init: function (game) {
        this.game = game;
        this.humanList = [];
        this.isRunning = false;
    },
    startSpawn () {
        this.spawnHuman();
        this.schedule(this.spawnHuman, this.spawnInterval);
        this.isRunning = true;
    },
    //-- 创建管道组
    spawnHuman () {
        let human = null;
        if (cc.pool.hasObject(Human)) {
            human = cc.pool.getFromPool(Human);
        } else {
            human = cc.instantiate(this.humanPrefab).getComponent(Human);
        }
        this.humanLayer.addChild(human.node);
        human.node.active = true;
        human.node.x = this.initHumanX;
        human.init(this);
        this.humanList.push(human);
    },
    despawnHuman (human) {
        human.node.removeFromParent();
        human.node.active = false;
        cc.pool.putInPool(human);
    },
    //-- 获取下个未通过的水管
    getNext: function () {
        return this.humanList.shift();
    },
    reset () {
        this.unschedule(this.spawnHuman);
        this.humanList = [];
        this.isRunning = false;
    },
    gainScore: function() {
        this.game.gainScore();
    }
});
