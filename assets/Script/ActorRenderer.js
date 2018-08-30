var Game = require('Game');
var Types = require('Types');
var Utils = require('Utils');
var ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        playerInfo: cc.Node,
        cardPrefab: cc.Prefab,
        anchorCards: cc.Node,
        spPlayerPhoto: cc.Sprite,
        cardSpace: 0,
        isCombo:true,
        timerSpeed:0,
        comboCount:0
    },

    onLoad: function () {
        this.callCounter = Game.instance.inGameUI.betCounter;
    },

    init: function ( playerInfo, playerInfoPos,turnDuration ) {
        // actor
        this.actor = this.getComponent('Actor');

        // nodes
        this.isCounting = false;
        this.counterTimer = 0;
        this.turnDuration = turnDuration;
        this.timerSpeed = 0;
        
        // nodes
        this.playerInfo.position = playerInfoPos;
        var photoIdx = playerInfo.photoIdx % 5;
        this.spPlayerPhoto.spriteFrame = Game.instance.assetMng.playerPhotos[photoIdx];
        // fx
        /*
        this.animFX = this.animFX.getComponent('FXPlayer');
        this.animFX.init();
        this.animFX.show(false);
        */
    },

    update: function (dt) {
        if (this.isCounting) {
            this.callCounter.progress = 1 - this.counterTimer/this.turnDuration;
            if(this.callCounter.progress <= 0.5){
                Game.instance.inGameUI.flagDark.active = true;
                Game.instance.inGameUI.flagLight.active = false;
                this.isCombo = false;
            }
            this.counterTimer += (dt + dt*0.05*this.timerSpeed);
            //cc.log("timer speed:"+this.timerSpeed + "   counterTimer:" + this.counterTimer);
            if (this.counterTimer >= this.turnDuration) {
                this.isCounting = false;
                this.callCounter.progress = 0;
                this.showFail();
            }
        }
    },

    startCountdown: function() {
        if (this.callCounter) {
            this.isCounting = true;
            this.counterTimer = 0;
        }
    },

    resetCountdown: function() {
        if (this.callCounter) {
            this.isCounting = false;
            this.counterTimer = 0;
            this.callCounter.progress = 0;
        }
    },

    showFail: function(){
        this.resetCountdown();
        Game.instance.destroyRestDiamond();
        Game.instance.inGameUI.showFailPanel();
        this.anchorCards.active = false;
        this.timerSpeed = 0;
    },
    showNormal:function(){
        this.anchorCards.removeChildByTag(1001);
        this.anchorCards.active = true;

    },

    oldCardFly: function(){
        if(this.isCombo){
            this.comboCount++;
            var comboNode = Game.instance.inGameUI.comboPanel;
            var labelCombo = Game.instance.inGameUI.labelCombo;
            labelCombo.string = this.comboCount
            comboNode.active = true;
            var scaleUpAction = cc.scaleBy(0.3,10,10);
            var delayShow = cc.delayTime(0.1);
            var scaleDownAction = cc.scaleBy(0.3,0.1,0.1);
            var callback = cc.callFunc(this.comboEnd,this);
            comboNode.runAction(cc.sequence(scaleUpAction,delayShow,scaleDownAction,callback));
        }else{
            this.comboCount = 0;
        }
        this.timerSpeed++;
        if(this.timerSpeed>=100){
            this.timerSpeed = 100;
        }
        var node = this.anchorCards.getChildByTag(1001);
        var moveOutAction = cc.moveTo(0.3,cc.v2(1500,0));
        var callback = cc.callFunc(this._onDealOnceEnd, this);
        node.runAction(cc.sequence(moveOutAction,callback));
    },
    comboEnd: function(){
        var comboNode = Game.instance.inGameUI.comboPanel;
        comboNode.active = false;
    },

    onDeal: function (type,card, show) {
        var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        this.anchorCards.addChild(newCard.node,1,1001);
        newCard.init(type,card);
        newCard.reveal(show);

        var startPos = cc.v2(-330, 200);
        var endPos = cc.v2(0, 0);
        newCard.node.setPosition(startPos);
        
        this.isCombo = true;
        //this._updatePointPos(endPos.x);

        var scaleAction = cc.scaleBy(0.5,10,10);
        var moveAction = cc.moveTo(0.5, endPos);
        var callback = cc.callFunc(this._onDealEnd, this);
        newCard.node.runAction(cc.sequence(cc.spawn(scaleAction,moveAction),callback));
    },

    onDealOnce: function (type,card, show) {
        var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        this.anchorCards.addChild(newCard.node,1,1001);
        newCard.init(type,card);
        newCard.reveal(show);

        var startPos = cc.v2(-330, 200);
        var endPos = cc.v2(0, 0);
        newCard.node.setPosition(startPos);
        
        //this._updatePointPos(endPos.x);

        var scaleAction = cc.scaleBy(0.5,10,10);
        var moveAction = cc.moveTo(0.5, endPos);
        var delayShow = cc.delayTime(0.5);
        var moveOutAction = cc.moveTo(0.5,cc.v2(1500,0));
        var callback = cc.callFunc(this._onDealOnceEnd, this);

        newCard.node.runAction(cc.sequence(cc.spawn(scaleAction,moveAction),delayShow,moveOutAction,callback));
    },
    _onDealOnceEnd: function(target) {
        this.anchorCards.removeChildByTag(1001);
        Game.instance.inGameUI.flagDark.active = false;
        Game.instance.inGameUI.flagLight.active = true;
        Game.instance.showCard();
    },

    _onDealEnd: function(target) {
        this.resetCountdown();
        this.startCountdown();
        Game.instance.inGameUI.btnYes.active = true;
        Game.instance.inGameUI.btnNo.active = true;
    },

    onReset: function () {
        this.cardInfo.active = false;
        this.anchorCards.removeAllChildren();
    }
});
