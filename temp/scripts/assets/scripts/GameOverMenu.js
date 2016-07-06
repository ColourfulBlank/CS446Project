"use strict";
cc._RFpush(module, '4678eF13qtCHJNCsB0DibjM', 'GameOverMenu');
// scripts/GameOverMenu.js

var GameOverMenu = cc.Class({
    'extends': cc.Component,
    properties: {
        btn_play: cc.Button,
        score: cc.Label
    },
    init: function init() {},
    restart: function restart() {
        cc.director.loadScene('Game');
    }
});

cc._RFpop();