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
        this.mainPic.spriteFrame = PicConfig.picConfigs[type].frames[card];
    },

    reveal: function (isFaceUp) {
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
    },
});
