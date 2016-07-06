"use strict";
cc._RFpush(module, 'bd45aCnlh9BU4QGW5CS7JGk', 'Car');
// scripts/Car.js

var Obstacle = require("Obstacle");

var Car = cc.Class({
    /*
    	Obstacle properties:
    speedX
    initX
    resetX
    initY
    */
    "extends": Obstacle,

    gooseVisit: function gooseVisit() {
        this.manager.carHit(this);
    }

});

cc._RFpop();