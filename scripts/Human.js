/*
    Human isn't actually an obstacle, but it behaves like one

    Just alter the behavior with Visitor pattern -- gooseVisit
*/


const Obstacle = require("Obstacle");


var Human = cc.Class({
    /*
        Obstacle properties:
            speedX
            initX
            resetX
            initY
    */
    extends: Obstacle,

    
    /*Implementing abstract method in interface*/

    /*
        ---Visitor pattern---
        called by goose when collide
    */
    gooseVisit() {
        this.manager.gainScore(this);
    },
});