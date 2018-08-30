var players = require('PlayerData').players;
var Decks = require('Decks');
var Types = require('Types');

var Game = cc.Class({
    extends: cc.Component,

    properties: {
        playerAnchor: cc.Node,
        playerPrefab: cc.Prefab,
        diamondAnchor: cc.Node,
        diamondPrefab: cc.Prefab,
        inGameUI: cc.Node,
        audioMng: cc.Node,
        assetMng: cc.Node,
        betDuration: 0,
        score: 0,
        diamond: 0,
        set:0,
        numberOfDecks: {
            default: 1,
            type: 'Integer'
        }
    },

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function () {
        Game.instance = this;
        this.inGameUI = this.inGameUI.getComponent('InGameUI');
        this.assetMng = this.assetMng.getComponent('AssetMng');
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.inGameUI.init(this.betDuration);

        this.player = null;
        this.createPlayer();

        this.diamondPool = new cc.NodePool('DiamondCollect');
        let diamondCount = 5;
        for(let i = 0;i < diamondCount;++i){
            let diamond = cc.instantiate(this.diamondPrefab);
            this.diamondPool.put(diamond);
        }

        this.set = Types.picSet;
        this.decks = new Decks(this.numberOfDecks);

        this.scheduleOnce(function(){
            this.showCardOnce();
        },0.1);

        this.audioMng.playMusic();
    },

    createDiamond:function(tag){
        let diamond = null;
        if(this.diamondPool.size() > 0){
            diamond = this.diamondPool.get();
        }else{
            diamond = cc.instantiate(this.diamondPrefab);
        }

        let random = Math.random();
        if(random > 0.0){
            diamond.getComponent('DiamondCollect').init(1);
        }
        let isMine = diamond.getComponent('DiamondCollect').getType();
        //生成随机位置
        random = Math.random();
        var idx_x = random * 10;
        random = Math.random();
        var idx_y = random * 5;
        let x = this.diamondAnchor.width/10 * idx_x;
        let y = this.diamondAnchor.height/5 * idx_y;
        cc.log("diamond pos:" + idx_x + "-" + idx_y);
        diamond.position = cc.v2(x,y);

        this.diamondAnchor.addChild(diamond,2,tag);
    },
    destroyDiamond:function(diamond,type){
        //1.玩家点击了某一个钻石
        let isMine = type;
        this.diamondPool.put(diamond);
        if(isMine){
            //点到雷了，失败
            this.player.showFail();
        }else{
            this.diamond++;
            this.inGameUI.labelDiamond.string = this.diamond;
        }
        
    },
    destroyRestDiamond:function(){
        //2.在一张图片的显示过程中，没有点击到的钻石，在切换下一张图片时需要回收
        for(let i = 0;i < 5;++i){
           let diamond = this.diamondAnchor.getChildByTag(2000+i);
           if(diamond != null){
               this.diamondPool.put(diamond);
           }
        }
    },
    createPlayer:function(){
        var playerNode = cc.instantiate(this.playerPrefab);
        var anchor = this.playerAnchor;
        anchor.addChild(playerNode);
        playerNode.position = cc.v2(0, 0);

        /*
        var playerInfoPos = cc.find('anchorPlayerInfo',anchor).getPosition();
        var actorRenderer = playerNode.getComponent('ActorRenderer');
        actorRenderer.init(players[0],playerInfoPos,this.betDuration);
        */
       var actorRenderer = playerNode.getComponent('ActorRenderer');
       actorRenderer.init(this.betDuration);

        this.player = playerNode.getComponent('Player');
        this.player.init();
    },

    showCardOnce: function(){
        this.player.addCardOnce(this.set,this.decks.draw(0));
    },

    showCard: function(){
        //this.inGameUI.btnYes.active = true;
        //this.inGameUI.btnNo.active = true;
        //随机个数，最多五个
        var random = Math.random();
        let diamondCount = (random * 5) | 0;
        for(let i = 0;i < diamondCount;++i){
            this.createDiamond(2000+i);
        }
        this.player.addCard(this.set,this.decks.draw(this.player.lastCard));
    },

    userButtonClick: function(mode,customEventData){
        //判断是否正确
        //customEventData 0-user click yes button 1-user click no button
        this.inGameUI.btnYes.active = false;
        this.inGameUI.btnNo.active = false;

        if(customEventData == this.player.isSame){  //正确，显示下一张图片
            //this.showCard();
            this.destroyRestDiamond();
            this.player.oldCardFly();
            var comboCount = this.player.renderer.comboCount;
            this.score += (1+comboCount);
            this.inGameUI.labelScore.string = this.score;
        }else{                      
            this.player.showFail();
        }
    },

    restart: function(){
        this.score = 0;
        this.player.renderer.comboCount = 0;
        this.inGameUI.labelScore.string = this.score;
        this.inGameUI.failBtnPanel.active = false;
        this.inGameUI.btnYes.active = false;
        this.inGameUI.btnNo.active = false;
        this.player.showNormal();
        this.showCardOnce();
    },

    quitToMenu: function () {
        cc.director.loadScene('menu');
    }

});
