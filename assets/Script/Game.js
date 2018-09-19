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
        propAnchor: cc.Node,
        propPrefab: cc.Prefab,
        smallPropPrefab: cc.Prefab,
        inGameUI: cc.Node,
        audioMng: cc.Node,
        assetMng: cc.Node,
        tutorialPanel: cc.Node,
        betDuration: 0,
        score: 0,
        diamond: 0,
        set:0,
        curPropType:-1,
        numberOfDecks: {
            default: 1,
            type: 'Integer'
        }
    },

    statics: {
        instance: null
    },

    startGame: function(){
        this.tutorialPanel.active = false;
        Game.instance = this;
        this.inGameUI = this.inGameUI.getComponent('InGameUI');
        this.assetMng = this.assetMng.getComponent('AssetMng');
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.inGameUI.init(this.betDuration);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.player = null;
        this.createPlayer();

        this.diamondPool = new cc.NodePool('DiamondCollect');
        let diamondCount = 5;
        for(let i = 0;i < diamondCount;++i){
            let diamond = cc.instantiate(this.diamondPrefab);
            this.diamondPool.put(diamond);
        }

        this.propPool = new cc.NodePool('Prop');
        let propCount = 2;
        for(let i = 0;i < propCount;++i){
            let prop = cc.instantiate(this.propPrefab);
            this.propPool.put(prop);
        }

        this.smallPropPool = new cc.NodePool('smallProp');
        propCount = 2;
        for(let i = 0;i < propCount;++i){
            let smallProp = cc.instantiate(this.smallPropPrefab);
            this.smallPropPool.put(smallProp);
        }

        this.set = Types.picSet;
        this.curPropType = -1;
        this.decks = new Decks(this.numberOfDecks);

        this.scheduleOnce(function(){
            this.showCardOnce();
        },0.1);
    },

    // use this for initialization
    onLoad: function () {
        if(Types.isFirst == 0){
            this.tutorialPanel.active = false;
            this.startGame();
        }else{
            this.tutorialPanel.active = true;
        }
    },
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onKeyUp: function (event) {
        if(event.keyCode == cc.KEY.back){
            cc.director.end();
        }
    },
    setNodePosWithRandom: function(node){
        //生成随机位置
        var random = Math.random();
        var idx_x = random * 10;
        random = Math.random();
        var idx_y = random * 5;
        let x = this.diamondAnchor.width/10 * idx_x;
        let y = this.diamondAnchor.height/5 * idx_y;
        //cc.log("diamond pos:" + idx_x + "-" + idx_y);
        node.position = cc.v2(x,y);
        return node;
    },
    createSmallProp: function(){
        let sProp = null;
        if(this.smallPropPool.size() > 0){
            sProp = this.smallPropPool.get();
        }else{
            sProp = cc.instantiate(this.smallPropPrefab);
        }
        let random = Math.random();
        let propType = (random * 4) | 0;
        sProp.getComponent('SmallProp').init(propType);
        sProp = this.setNodePosWithRandom(sProp);
        this.diamondAnchor.addChild(sProp,2,3000);
    },
    destroySProp:function(sProp,propType){
        this.curPropType = propType;
        this.smallPropPool.put(sProp);
        this.createProp(propType);
    },
    destroyRestSProp:function(){
        let sProp = this.diamondAnchor.getChildByTag(3000);
        if(sProp != null){
            this.smallPropPool.put(sProp);
        }
    },
    createDiamond:function(tag){
        let diamond = null;
        if(this.diamondPool.size() > 0){
            diamond = this.diamondPool.get();
        }else{
            diamond = cc.instantiate(this.diamondPrefab);
        }

        let random = Math.random();
        if(random > 0.9){
            diamond.getComponent('DiamondCollect').init(1);
        }
        diamond = this.setNodePosWithRandom(diamond);
        this.diamondAnchor.addChild(diamond,2,tag);
    },
    destroyDiamond:function(diamond,type){
        //1.玩家点击了某一个钻石
        let isMine = type;
        this.diamondPool.put(diamond);
        if(isMine){
            //点到雷了，失败
            if(this.curPropType != 3){
                this.showFail();
            }
        }else{
            this.audioMng.playDiamond();
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
    autoGetDiamond: function(){

        var vec2;
        let prop = this.propAnchor.getChildByTag(4000);
        if(prop != null){
            var pos = prop.getPosition();
            vec2 = this.propAnchor.convertToWorldSpace(pos);
            vec2 = vec2.sub(cc.v2(prop.width * 1.5,prop.height*1.5));
        }

        for(let i = 0;i < 5;++i){
            let diamond = this.diamondAnchor.getChildByTag(2000+i);
            if(diamond != null){
                if(diamond.getChildByName('diamond').active){
                    this.diamond++;
                    var moveAction = cc.moveTo(0.2,vec2);
                    var callback = cc.callFunc(this._autoGetDiamondEnd, this,diamond);
                    diamond.runAction(cc.sequence(moveAction,callback));
                }
            }
         }
    },
    _autoGetDiamondEnd: function(node){
        this.inGameUI.labelDiamond.string = this.diamond;
        this.diamondPool.put(node);
    },
    createProp:function(propType){
        this.audioMng.playProp();
        let prop = null;
        if(this.propPool.size() > 0){
            prop = this.propPool.get();
        }else{
            prop = cc.instantiate(this.propPrefab);
        }
        prop.getComponent('Prop').init(propType,this.betDuration*3);
        this.propAnchor.addChild(prop,2,4000);
    },
    destroyProp:function(){
        let prop = this.propAnchor.getChildByTag(4000);
        if(prop != null){
            this.propPool.put(prop);
        }
        this.curPropType = -1;
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
        //随机个数，最多五个
        var random = Math.random();
        let diamondCount = (random * 5) | 0;
        for(let i = 0;i < diamondCount;++i){
            this.createDiamond(2000+i);
        }

        if(this.curPropType == -1){
            random = Math.random();
            if(random > 0.85){
                this.createSmallProp();
            }
        }

        this.player.addCard(this.set,this.decks.draw(this.player.lastCard));
    },

    userButtonClick: function(mode,customEventData){
        //判断是否正确
        //customEventData 0-user click yes button 1-user click no button
        this.inGameUI.btnYes.active = false;
        this.inGameUI.btnNo.active = false;

        if(customEventData == this.player.isSame || this.curPropType == 1){  //正确，显示下一张图片
            //this.showCard();
            this.audioMng.playWin();
            this.destroyRestDiamond();
            this.destroyRestSProp();
            this.player.oldCardFly();
            var comboCount = this.player.renderer.comboCount;
            if(this.curPropType == 0){
                this.score += (2+comboCount);
            }else{
                this.score += (1+comboCount);
            }
            
            this.inGameUI.labelScore.string = this.score;
        }else{                     
            //游戏结束，显示分数和钻石，如果超过了最高分，则显示最高分 
            this.showFail();
        }
    },

    showFail: function(){
        this.audioMng.playLose();
        //比较当前得分和最高分
        let isHighScore = false;
        let highScore = Number(cc.sys.localStorage.getItem('highScore0'));
        if(this.score > highScore){
            isHighScore = true;
            highScore = this.score;
            cc.sys.localStorage.setItem('highScore0',this.score);
        }
        
        let sDiamondTotal = cc.sys.localStorage.getItem('diamondCount');
        let diamondTotal = Number(sDiamondTotal);
        diamondTotal += this.diamond;
        cc.sys.localStorage.setItem('diamondCount',diamondTotal);
        this.curPropType = -1;
        this.player.showFail(this.score,this.diamond,highScore,diamondTotal,isHighScore);
    },

    restart: function(){
        this.audioMng.playButton();
        this.score = 0;
        this.diamond = 0;
        this.player.renderer.comboCount = 0;
        this.inGameUI.labelScore.string = this.score;
        this.inGameUI.labelDiamond.string = this.diamond;
        this.inGameUI.failBtnPanel.active = false;
        this.inGameUI.btnYes.active = false;
        this.inGameUI.btnNo.active = false;
        this.player.showNormal();
        this.showCardOnce();
    },

    quitToMenuCallBack: function(){
        if (typeof FBInstant === 'undefined') return;
        FBInstant.canCreateShortcutAsync()
        .then(function(canCreateShortcut) {
          if (canCreateShortcut) {
            FBInstant.createShortcutAsync()
              .then(function() {
                // Shortcut created
              })
              .catch(function() {
                // Shortcut not created
              });
          }
        });
    },
    quitToMenu: function () {
        this.audioMng.playButton();
        var callback = cc.callFunc(this.quitToMenuCallBack, this);
        cc.director.loadScene('menu');
    },
    onShareGame: function(){
        if (typeof FBInstant === 'undefined') return;
        let highScore = Number(cc.sys.localStorage.getItem('highScore0'));
        var txt = "my best score is " + highScore + ",come and challenge me!"
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: this.getImgBase64(),
            text: txt,
            data: {myReplayData: '...'},
        }).then(() => {
            // continue with the game.
        });
    },
    // 截屏返回 iamge base6，用于 Share
    getImgBase64 () {

        let target = cc.find('Canvas');
        let width = 1334, height = 750;
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        }
        else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        return canvas.toDataURL('image/png');
    }

});
