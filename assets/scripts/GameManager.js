var Goose = require('Goose');
var Scroller = require('Scroller');
var HumanManager = require('HumanManager');
var CarManager = require('CarManager');



var GameState = cc.Enum({
    Menu: -1,
    Run : -1,
    Over: -1
});
var GameManager = cc.Class({
    extends: cc.Component,
    //-- 属性
    properties: {
        //-- 获取绵羊
        goose: Goose,
        //-- 获取背景
        // sky: Scroller,
        // //-- 获取地面
        // ground: Scroller,
        //-- 获取障碍物管理
        humanManager: HumanManager,
        carManager: CarManager,
        //-- 获取gameOverMenu对象
        gameOverMenu: cc.Node,
        //-- 获取分数对象
        scoreText: cc.Label,
        //-- 获取背景音效
        gameBgAudio: {
            default: null,
            url: cc.AudioClip
        },
        //-- 获取死亡音效
        dieAudio: {
            default: null,
            url: cc.AudioClip
        },
        //-- 获取失败音效
        gameOverAudio: {
            default: null,
            url: cc.AudioClip
        },
        //-- 获取得分音效
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad () {
        //-- 游戏状态
        this.gameState = GameState.Menu;
        //-- 分数
        this.score = 0;
        this.scoreText.string = this.score;
        this.gameOverMenu.active = false;
        this.goose.init(this);
        this.humanManager.init(this);
        this.carManager.init(this);
        
        
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
        
    },
    //-- 开始
    start () {
        this.gameState = GameState.Run;
        this.score = 0;
        this.humanManager.startSpawn();
        this.carManager.startSpawn();
        this.goose.startRun();
    },
    gameOver () {
        
        this.goose.state = Goose.State.Dead;
        this.goose.enableInput(false);
        
        //-- 背景音效停止，死亡音效播放
        // cc.audioEngine.stopMusic(this.gameBgAudio);
        // cc.audioEngine.playEffect(this.dieAudio);
        // cc.audioEngine.playEffect(this.gameOverAudio);
        this.humanManager.reset();
        this.carManager.reset();
        this.gameState = GameState.Over;
        this.gameOverMenu.active = true;
        this.gameOverMenu.getComponent('GameOverMenu').score.string = this.score;
    },
    //-- 更新分数
    gainScore () {
        //-- 分数+1
        this.score++;
        this.scoreText.string = this.score;
        //-- 分数增加音效
        // cc.audioEngine.playEffect(this.scoreAudio);
    },
    update(dt) {
    },
});
