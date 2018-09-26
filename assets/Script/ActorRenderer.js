var Game = require('Game');
var Types = require('Types');
var Utils = require('Utils');
var ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        cardPrefab: cc.Prefab,
        anchorCards: cc.Node,
        cardSpace: 0,
        isCombo:true,
        timerSpeed:0,
        comboCount:0
    },

    onLoad: function () {
        this.callCounter = Game.instance.inGameUI.betCounter;
        this.cardPool = new cc.NodePool();
        let initCount = 2;
        for(let i = 0;i < initCount;++i){
            let card = cc.instantiate(this.cardPrefab);
            this.cardPool.put(card);
        }
    },

    createCard: function () {
        let card = null;
        if (this.cardPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            card = this.cardPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            card = cc.instantiate(this.cardPrefab);
        }
        card.scale = 0.1;
        return card;
    },

    init: function ( turnDuration ) {
        // actor
        this.actor = this.getComponent('Actor');

        // nodes
        this.isCounting = false;
        this.counterTimer = 0;
        this.turnDuration = turnDuration;
        this.timerSpeed = 0;
        
        // nodes
        /*
        this.playerInfo.position = playerInfoPos;
        var photoIdx = playerInfo.photoIdx % 5;
        this.spPlayerPhoto.spriteFrame = Game.instance.assetMng.playerPhotos[photoIdx];
        // fx
        
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
                Game.instance.showFail();
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

    showFail: function(score,diamond,highScore,diamondTotal,isHighScore){
        this.resetCountdown();
        Game.instance.destroyRestSProp();
        Game.instance.destroyRestDiamond();
        Game.instance.destroyProp();
        Game.instance.inGameUI.showFailPanel(score,diamond,highScore,diamondTotal,isHighScore);
        this.anchorCards.active = false;
        this.timerSpeed = 0;
    },
    showNormal:function(){
        var node = this.anchorCards.getChildByTag(1001);
        this.cardPool.put(node);
        //this.anchorCards.removeChildByTag(1001);
        this.anchorCards.active = true;

    },

    oldCardFly: function(){
        this.isCounting = false;
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
        var callback = cc.callFunc(this._onDealOnceEnd, this,node);
        node.runAction(cc.sequence(moveOutAction,callback));
    },
    comboEnd: function(){
        var comboNode = Game.instance.inGameUI.comboPanel;
        comboNode.active = false;
    },

    onDeal: function (type,card, show) {
        var cardNode = this.createCard();
        var newCard = cardNode.getComponent('Card');
        this.anchorCards.addChild(cardNode,1,1001);
        newCard.init(type,card);

        var startPos = cc.v2(-330, 200);
        var endPos = cc.v2(0, 0);
        cardNode.setPosition(startPos);
        
        this.isCombo = true;

        var scaleAction = cc.scaleBy(0.5,10,10);
        var moveAction = cc.moveTo(0.5, endPos);
        var callback = cc.callFunc(this._onDealEnd, this);
        cardNode.runAction(cc.sequence(cc.spawn(scaleAction,moveAction),callback));
    },

    onDealOnce: function (type,card, show) {
        var cardNode = this.createCard();
        var newCard = cardNode.getComponent('Card');
        this.anchorCards.addChild(cardNode,1,1001);
        newCard.init(type,card);

        var startPos = cc.v2(-330, 200);
        var endPos = cc.v2(0, 0);
        cardNode.setPosition(startPos);

        var scaleAction = cc.scaleBy(0.5,10,10);
        var moveAction = cc.moveTo(0.5, endPos);
        var delayShow = cc.delayTime(0.5);
        var moveOutAction = cc.moveTo(0.5,cc.v2(1500,0));
        var callback = cc.callFunc(this._onDealOnceEnd, this,cardNode);

        newCard.node.runAction(cc.sequence(cc.spawn(scaleAction,moveAction),delayShow,moveOutAction,callback));
    },
    _onDealOnceEnd: function(target,node) {
        //this.anchorCards.removeChildByTag(1001);
        this.cardPool.put(node);
        Game.instance.inGameUI.flagDark.active = false;
        Game.instance.inGameUI.flagLight.active = true;
        Game.instance.showCard();
    },

    _onDealEnd: function(target) {
        this.resetCountdown();
        this.startCountdown();
        Game.instance.inGameUI.btnYes.active = true;
        Game.instance.inGameUI.btnNo.active = true;
        if(Game.instance.curPropType == 2){
            //cc.log("钻石快到碗里来");
            Game.instance.autoGetDiamond();

        }
    },

    onReset: function () {
        this.cardInfo.active = false;
        this.anchorCards.removeAllChildren();
    }
});
