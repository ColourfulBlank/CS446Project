var GameOverMenu = cc.Class({
    extends: cc.Component,
    properties: {
        btn_play: cc.Button, //restart button
        score: cc.Label
    },
    init: function () {
    },
    restart: function () {
        cc.director.loadScene('Game');
    },
});
