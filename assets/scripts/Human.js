var Human = cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0,
        resetX: 0,
    },
    init (humanMng) {
        this.humanMng = humanMng;
    },
    
    
    
    
    update: function (dt) {
        if (this.humanMng.isRunning === false) {
            return;
        }
        this.node.x += this.speed * dt;
        if (this.node.x < this.resetX) {
            this.humanMng.despawnHuman(this);
        }
    },
    
    onCollisionEnter: function (other, self) {
        if (other.tag === 0) {//goose
            this.humanMng.despawnHuman(this);
            this.humanMng.gainScore();
        }
    },
    
    
    

    
});
