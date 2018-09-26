var Game = require('Game');
var PicConfig = require('PicConfig');
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
            this.mainPic.spriteFrame = Game.instance.assetMng.animal1[card];
        }else if(type == 2){
            this.mainPic.spriteFrame = Game.instance.assetMng.animal2[card];
        }else if(type == 3){
            this.mainPic.spriteFrame = Game.instance.assetMng.cartoon[card];
        }else if(type == 4){
            this.mainPic.spriteFrame = Game.instance.assetMng.girl[card];
        }
    },

    reveal: function (isFaceUp) {
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
    },
});
