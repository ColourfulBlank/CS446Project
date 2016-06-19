var GameStart = cc.Class({
    //-- 继承
    extends: cc.Component,
    //-- 属性
    properties: {
        btn_play: cc.Button,
    },
    //-- 构造函数
    init (game) {
        this.game = game;
        
    },
    // 加载Game场景(重新开始游戏)
    startGame: function () {
        this.game.start();
        //cc.director.loadScene('Game');
    },
});
