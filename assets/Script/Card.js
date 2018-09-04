var Game = require('Game');
cc.Class({
    extends: cc.Component,

    properties: {
        // nodes
        mainPic: cc.Sprite,
        cardBG: cc.Sprite,
        // resources
        texFrontBG: cc.SpriteFrame,
        texBackBG: cc.SpriteFrame
    },

    // use this for initialization
    init: function (type,card) {
        if(type == 0){
            this.mainPic.spriteFrame = Game.instance.assetMng.fruit[card];
        }else if(type == 1){
            this.mainPic.spriteFrame = Game.instance.assetMng.vegetable[card];
        }else if(type == 2){
            this.mainPic.spriteFrame = Game.instance.assetMng.animal1[card];
        }else if(type == 3){
            this.mainPic.spriteFrame = Game.instance.assetMng.animal2[card];
        }else if(type == 4){
            this.mainPic.spriteFrame = Game.instance.assetMng.fish[card];
        }else if(type == 5){
            this.mainPic.spriteFrame = Game.instance.assetMng.cactus[card];
        }else if(type == 6){
            this.mainPic.spriteFrame = Game.instance.assetMng.sea[card];
        }else if(type == 7){
            this.mainPic.spriteFrame = Game.instance.assetMng.cartnoon[card];
        }else if(type == 8){
            this.mainPic.spriteFrame = Game.instance.assetMng.girl[card];
        }else if(type == 9){
            this.mainPic.spriteFrame = Game.instance.assetMng.girl2[card];
        }
    },

    reveal: function (isFaceUp) {
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
    },
});
