const Obstacle = require("Obstacle");

var State = cc.Enum({
    None   : -1,
    Run    : -1,
    Jump   : -1,
    Drop   : -1,
    DropEnd: -1,
    Dead   : -1
});


var Sheep = cc.Class({
    extends: cc.Component,
    properties: {
        colliderRadius: 0,
        maxY: 0,
        groundY: 0,
        gravity: 0,
        initJumpSpeed: 0,
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
                        var animName = State[this._state];
                        this.anim.stop();
                        this.anim.play(animName);
                    }
                }
            },
            type: State
        },
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        },
    },
    statics: {
        State: State
    },
    init (game) {
        this.game = game;
        this.anim = this.getComponent(cc.Animation);
        this.currentSpeed = 0;
        this.sprite = this.getComponent(cc.Sprite);
        this.registerInput();
        
        this.groundY = this.node.y;
    },
    startRun () {
        this.state = State.Run;
        this.enableInput(true);
    },
    registerInput () {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                this.jump();
            }.bind(this)
        }, this.node);
        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                this.jump();
                return true;
            }.bind(this)
        }, this.node);
    },
    enableInput: function (enable) {
        if (enable) {
            cc.eventManager.resumeTarget(this.node);
        } else {
            cc.eventManager.pauseTarget(this.node);
        }
    },

    update (dt) {
        if (this.state === State.None || this.state === State.Dead) {
            return;
        }
        this._updateState(dt);
        this._updatePosition(dt);
    },
    _updateState (dt) {
        switch (this.state) {
            case Sheep.State.Jump:
                if (this.currentSpeed < 0) {
                    this.state = State.Drop;
                }
                break;
            case Sheep.State.Drop:
                if (this.node.y < this.groundY) {
                    this.node.y = this.groundY;
                    this.state = State.DropEnd;
                }
                break;
        }
    },
    onDropFinished () {
        this.state = State.Run;
    },
    _updatePosition (dt) {
        var flying = this.state === Sheep.State.Jump || this.node.y > this.groundY;
        if (flying) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
        }
    },
    jump: function () {
        this.state = State.Jump;
        this.currentSpeed = this.initJumpSpeed;
        console.log(1123);
        // cc.audioEngine.playEffect(this.jumpAudio);
    },


    onCollisionEnter: function (other, self) {
        if (other instanceof Obstacle) {
            other.gooseVisit();    
        }
    },
});