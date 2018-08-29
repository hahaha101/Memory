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
            this.mainPic.spriteFrame = Game.instance.assetMng.fruitPhotos[card];
        }else if(type == 1){
            this.mainPic.spriteFrame = Game.instance.assetMng.vegetables[card];
        }
    },

    reveal: function (isFaceUp) {
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
    },
});
