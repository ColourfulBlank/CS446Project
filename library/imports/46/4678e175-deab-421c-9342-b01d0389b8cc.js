var GameOverMenu = cc.Class({
    'extends': cc.Component,
    properties: {
        btn_play: cc.Button, //restart button
        score: cc.Label
    },
    init: function init() {},
    restart: function restart() {
        cc.director.loadScene('Game');
    }
});