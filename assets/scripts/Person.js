var State = cc.Enum({
    None   : -1,
    person_run    : -1
});

var Person = cc.Class({
    //-- 继承
    extends: cc.Component,
    //-- 属性
    properties: {
        colliderRadius: 0,
        //-- Y轴最大高度
        maxY: 0,
        //-- 地面高度
        groundY: 0,
        //-- 重力
        gravity: 0,
        //-- 起跳速度
        initJumpSpeed: 0,
        //-- 绵羊状态
        _state: {
            default: State.None,
            type: State,
            visible: false
        },
        state: {
            get: function () {
                return this._state;
            },
            set: function(value){
                if (value !== this._state) {
                    this._state = value;
                    if (this._state !== State.None) {
                        console.log("set value");
                        var animName = 'person_run';
                        console.log(animName);
                        this.anim.stop();
                        this.anim.play(animName);
                    }
                }
            },
            type: State
        },
    },
    statics: {
        State: State
    },
    init (game) {
        console.log(game);
        console.log("init");
        this.game = game;
        //-- 当前播放动画组件
        this.anim = this.getComponent(cc.Animation);
        console.log("animate");
        //-- 当前速度
        this.currentSpeed = 0;
        //-- 绵羊图片渲染
        this.sprite = this.getComponent(cc.Sprite);
        console.log("done");
        //this.state = State.Run;
        
        //this.anim.play(animName);
    },
    startRun () {
        //var animName = State[this._state];
        console.log("start running");
        this.state = State.Run;
    },
    //-- 更新
    update (dt) {
        if (this.state === State.None) {
            return;
        }
    }
});