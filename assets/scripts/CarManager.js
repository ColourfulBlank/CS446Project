const Car = require('Car');

var CarManager = cc.Class({
    extends: cc.Component,
    //-- 属性
    properties: {
        carPrefab: cc.Prefab,
        carLayer: cc.Node,
        initCarX: 0,
    },
    //-- 初始化
    init: function (game) {
        this.game = game;
        this.carList = [];
        this.isRunning = false;
        this.timeSinceLastSpawn = 0;
    },
    startSpawn() {
        this.isRunning = true;
    },
    //-- 创建管道组
    spawnCar () {
        if (!this.isRunning) {
            return;
        }
        let car = null;
        if (cc.pool.hasObject(Car)) {
            car = cc.pool.getFromPool(Car);
        } else {
            car = cc.instantiate(this.carPrefab).getComponent(Car);
        }
        this.carLayer.addChild(car.node);
        car.node.active = true;
        car.node.x = this.initCarX;
        car.init(this);
        this.carList.push(car);
    },
    despawnCar (car) {
        car.node.removeFromParent();
        car.node.active = false;
        cc.pool.putInPool(car);
    },
    //-- 获取下个未通过的水管
    getNext: function () {
        return this.carList.shift();
    },
    reset () {
        this.unschedule(this.spawnCar);
        this.carList = [];
        this.isRunning = false;
    },
    gainScore: function() {
        this.game.gainScore();
    },
    gameOver: function() {
        this.game.gameOver();
    }
});
