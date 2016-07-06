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

    

    gooseVisit() {
        this.manager.gainScore(this);
    },
});