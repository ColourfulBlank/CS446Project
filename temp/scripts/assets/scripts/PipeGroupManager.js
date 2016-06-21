"use strict";
cc._RFpush(module, 'ded04ocxo1Pcopg6kafVPGn', 'PipeGroupManager');
// scripts/PipeGroupManager.js

var PipeGroup = require('PipeGroup');

var PipeGroupManager = cc.Class({
    'extends': cc.Component,
    //-- 属性
    properties: {
        pipePrefab: cc.Prefab,
        pipeLayer: cc.Node,
        initPipeX: 0,
        //-- 创建PipeGroup需要的时间
        spawnInterval: 0
    },
    //-- 初始化
    init: function init(game) {
        this.game = game;
        this.pipeList = [];
        this.isRunning = false;
    },
    startSpawn: function startSpawn() {
        this.spawnPipe();
        this.schedule(this.spawnPipe, this.spawnInterval);
        this.isRunning = true;
    },
    //-- 创建管道组
    spawnPipe: function spawnPipe() {
        var pipeGroup = null;
        if (cc.pool.hasObject(PipeGroup)) {
            pipeGroup = cc.pool.getFromPool(PipeGroup);
        } else {
            pipeGroup = cc.instantiate(this.pipePrefab).getComponent(PipeGroup);
        }
        this.pipeLayer.addChild(pipeGroup.node);
        pipeGroup.node.active = true;
        pipeGroup.node.x = this.initPipeX;
        pipeGroup.init(this);
        this.pipeList.push(pipeGroup);
    },
    despawnPipe: function despawnPipe(pipe) {
        pipe.node.removeFromParent();
        pipe.node.active = false;
        cc.pool.putInPool(pipe);
    },
    //-- 获取下个未通过的水管
    getNext: function getNext() {
        return this.pipeList.shift();
    },
    reset: function reset() {
        this.unschedule(this.spawnPipe);
        this.pipeList = [];
        this.isRunning = false;
    }
});

cc._RFpop();