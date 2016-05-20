"use strict";
cc._RFpush(module, '86bddrRzbtJsbCULMW5CyNK', 'move');
// game/script/move.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.w:
                    case cc.KEY.up:
                        console.log('turn left');
                        self.node.y += 50;
                        break;
                    case cc.KEY.a:
                    case cc.KEY.left:
                        console.log('turn left');
                        self.node.x -= 50;
                        break;
                    case cc.KEY.s:
                    case cc.KEY.down:
                        console.log('turn left');
                        self.node.y -= 50;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        console.log('turn right');
                        self.node.x += 50;
                        break;
                }
            }
        }, self.node);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();