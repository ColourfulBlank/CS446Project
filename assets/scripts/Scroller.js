cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0,
        resetX: 0
    },

    init (speedMod) {
        this.speed *= speedMod;
    },
    update (dt) {
        this.node.x += this.speed * dt;
        if (this.node.x <= this.resetX) {
            this.node.x -= this.resetX;
        }
    }
});
