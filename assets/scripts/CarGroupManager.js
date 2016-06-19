const CarGroup = require('CarGroup');

var CarGroupManager = cc.Class({
    extends: cc.Component,
    //-- 属性
    properties: {
        carPrefab: cc.Prefab,
        carLayer: cc.Node,
        initPipeX: 0,
        //-- 创建PipeGroup需要的时间
        spawnInterval: 0
    },
    //-- 初始化
    init: function (game) {
        this.game = game;
        this.pipeList = [];
        this.isRunning = false;
    },
    startSpawn () {
        //cc.log(PipeGroupManager, "startSpawn");
        this.spawnPipe();
        this.schedule(this.spawnPipe, this.spawnInterval);
        this.isRunning = true;
    },
    //-- 创建管道组
    spawnPipe () {
        let carGroup = null;
        console.log(CarGroup);
        if (cc.pool.hasObject(CarGroup)) {
            carGroup = cc.pool.getFromPool(CarGroup);
        } else {
            carGroup = cc.instantiate(this.carPrefab).getComponent(CarGroup);
        }
        console.log(carGroup);
        this.carLayer.addChild(carGroup.node);
        carGroup.node.active = true;
        carGroup.node.x = this.initPipeX;
        carGroup.init(this);
        this.pipeList.push(carGroup);
    },
    despawnPipe (pipe) {
        pipe.node.removeFromParent();
        pipe.node.active = false;
        cc.pool.putInPool(pipe);
    },
    //-- 获取下个未通过的水管
    getNext: function () {
        return this.pipeList.shift();
    },
    reset () {
        this.unschedule(this.spawnPipe);
        this.pipeList = [];
        this.isRunning = false;
    }
});
