"use strict";
cc._RFpush(module, '930d5LshrZBkbsK0b05li7R', 'Scroller');
// scripts/Scroller.js

cc.Class({
    "extends": cc.Component,
    properties: {
        speed: 0,
        resetX: 0
    },

    init: function init(speedMod) {
        this.speed *= speedMod;
    },
    update: function update(dt) {
        this.node.x += this.speed * dt;
        if (this.node.x <= this.resetX) {
            this.node.x -= this.resetX;
        }
    }
});

cc._RFpop();