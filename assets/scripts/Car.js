var Car = cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0,
        resetX: 0,
    },
    init (carMng) {
        this.carMng = carMng;
    },
    
    
    
    
    update: function (dt) {
        if (this.carMng.isRunning === false) {
            return;
        }
        this.node.x += this.speed * dt;
        if (this.node.x < this.resetX) {
            this.carMng.despawnCar(this);
        }
    },
    
    onCollisionEnter: function (other, self) {
        if (other.tag === 0) {//goose
            this.carMng.gameOver();
        }
    },
    
});
