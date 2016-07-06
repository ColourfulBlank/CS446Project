"use strict";
cc._RFpush(module, '506c3/W+f5PH4D8eAX3DQik', 'Human');
// scripts/Human.js

/*
    Human isn't actually an obstacle, but it behaves like one

    Just alter the behavior with Visitor pattern -- gooseVisit
*/

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

    /*Implementing abstract method in interface*/

    /*
        ---Visitor pattern---
        called by goose when collide
    */
    gooseVisit: function gooseVisit() {
        this.manager.gainScore(this);
    }
});

cc._RFpop();