"use strict";
cc._RFpush(module, '97ca5Hx+7VEy425oaf76L9U', 'Dust');
// scripts/Dust.js

cc.Class({
    "extends": cc.Component,

    properties: {
        anim: cc.Animation
    },

    // use this for initialization
    playAnim: function playAnim(animName) {
        this.anim.play(animName);
    },

    finish: function finish() {
        this.node.removeFromParent();
        cc.pool.putInPool(this);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();