"use strict";
cc._RFpush(module, '5026dczn8lKZpq2Z+LGadpZ', 'PipeGroup');
// scripts/PipeGroup.js

var PipeGroup = cc.Class({
    "extends": cc.Component,
    properties: {
        speed: 0,
        resetX: 0,
        botYRange: cc.p(0, 0),
        spacingRange: cc.p(0, 0),
        topPipe: cc.Node,
        botPipe: cc.Node
    },
    init: function init(pipeMng) {
        this.pipeMng = pipeMng;
        var botYPos = this.botYRange.x + Math.random() * (this.botYRange.y - this.botYRange.x);
        var space = this.spacingRange.x + Math.random() * (this.spacingRange.y - this.spacingRange.x);
        var topYPos = botYPos + space;
        this.topPipe.y = topYPos;
        this.botPipe.y = botYPos;
    },
    update: function update(dt) {
        if (this.pipeMng.isRunning === false) {
            return;
        }
        this.node.x += this.speed * dt;
        if (this.node.x < this.resetX) {
            this.pipeMng.despawnPipe(this);
        }
    }
});

cc._RFpop();