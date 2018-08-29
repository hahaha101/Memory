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
        
    },

    // LIFE-CYCLE CALLBACKS:
    onSelect: function(){
        console.log("onSelect");
        Game.instance.destroyDiamond(this);
    },

    onLoad: function () {
        this.node.selected = false;
        this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
    },

    unuse: function () {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
    },

    reuse: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
    },

    start () {

    },

    // update (dt) {},
});
