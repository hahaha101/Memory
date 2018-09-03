// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Game = require('Game');
cc.Class({
    extends: cc.Component,

    properties: {
        // nodes
        mainPic: cc.Sprite,
        propCounter: cc.ProgressBar
    },

    init: function(type,duration){
        this.mainPic.spriteFrame = Game.instance.assetMng.propPhotos[type];
        this.counterTimer = 0;
        this.isPropCounting = true;
        this.turnDuration = duration;
    },

    update: function (dt) {
        //cc.log(dt);
        if(this.isPropCounting){
            this.propCounter.progress = 1 - this.counterTimer/this.turnDuration;
        }
        this.counterTimer += dt;
        if (this.counterTimer >= this.turnDuration) {
            this.isPropCounting = false;
            this.propCounter.progress = 0;
            Game.instance.destroyProp();
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
