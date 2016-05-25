cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD, 
            onKeyPressed: function(keyCode, event) {
                var move;
                switch(keyCode) {
                    case cc.KEY.w:
                    case cc.KEY.up:
                        move = cc.moveBy(0.3, cc.p(0, 50)).easing(cc.easeCubicActionOut());
                        break;
                    case cc.KEY.a:
                    case cc.KEY.left:
                        move = cc.moveBy(0.3, cc.p(-50, 0)).easing(cc.easeCubicActionOut());
                        break;
                    case cc.KEY.s:
                    case cc.KEY.down:
                        move = cc.moveBy(0.3, cc.p(0, -50)).easing(cc.easeCubicActionOut());
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        move = cc.moveBy(0.3, cc.p(50, 0)).easing(cc.easeCubicActionOut());
                        break;
                }
                self.node.runAction(move);
            }
        }, self.node);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
