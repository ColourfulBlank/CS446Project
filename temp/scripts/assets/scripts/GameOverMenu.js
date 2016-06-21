"use strict";
cc._RFpush(module, '42ba7gAyfpGZqXEsckB6M2a', 'GameOverMenu');
// scripts/GameOverMenu.js

var GameOverMenu = cc.Class({
    //-- 继承
    'extends': cc.Component,
    //-- 属性
    properties: {
        btn_play: cc.Button,
        score: cc.Label
    },
    //-- 构造函数
    init: function init() {},
    // 加载Game场景(重新开始游戏)
    restart: function restart() {
        cc.director.loadScene('Game');
    }
});

cc._RFpop();