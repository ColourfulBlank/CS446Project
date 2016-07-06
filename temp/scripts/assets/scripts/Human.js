"use strict";
cc._RFpush(module, '506c3/W+f5PH4D8eAX3DQik', 'Human');
// scripts/Human.js

var Obstacle = require("Obstacle");

var Human = cc.Class({
    /*
        Obstacle properties:
            speedX
            initX
            resetX
            initY
    */
    "extends": Obstacle,

    gooseVisit: function gooseVisit() {
        this.manager.gainScore(this);
    }
});

cc._RFpop();