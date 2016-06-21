"use strict";
cc._RFpush(module, 'b90489JvD1O1pgXMQXSKGr7', 'Scroller');
// scripts/Scroller.js

cc.Class({
    //-- 继承
    "extends": cc.Component,
    //-- 属性
    properties: {
        //-- 滚动的速度
        speed: 0,
        //-- X轴边缘
        resetX: 0
    },

    init: function init(speedMod) {
        this.speed *= speedMod;
    },
    //-- 更新
    update: function update(dt) {
        this.node.x += this.speed * dt;
        if (this.node.x <= this.resetX) {
            this.node.x -= this.resetX;
        }
    }
});

cc._RFpop();