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
        diamond: cc.Sprite,
        mine: cc.Sprite,
        type: 0
    },
    init: function(type){
        if(type == 0){
            this.diamond.node.active = true;
            this.mine.node.active = false;
        }else{
            this.diamond.node.active = false;
            this.mine.node.active = true;
        }
        this.type = type;
    },
    getType: function(){
        return this.type;
    },
    // LIFE-CYCLE CALLBACKS:
    onSelect: function(){
       // cc.log(this.getChildByName('diamond').name);
        // TODO 没闹明白为什么这里this.type不能用了
        if(this.getChildByName('diamond').active){
            Game.instance.destroyDiamond(this,0);
        }else{
            Game.instance.destroyDiamond(this,1);
        }
        
    },

    onLoad: function () {
        this.type = 0;
        this.node.selected = false;
        this.diamond.node.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.mine.node.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
    },

    unuse: function () {
        this.diamond.node.off(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.mine.node.off(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
    },

    reuse: function () {
        this.diamond.node.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.mine.node.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
    },

    start () {

    },

    // update (dt) {},
});
