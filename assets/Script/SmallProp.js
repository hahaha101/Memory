
var Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
       double: cc.Node,
       heal: cc.Node,
       magnet: cc.Node,
       shield: cc.Node
    },

    init: function(type){
        this.double.active = false;
        this.heal.active = false;
        this.magnet.active = false;
        this.shield.active = false;
        if(type == 0){
            this.double.active = true;
        }else if(type == 1){
            this.heal.active = true;
        }else if(type == 2){
            this.magnet.active = true;
        }else{
            this.shield.active = true;
        }
    },
    // LIFE-CYCLE CALLBACKS:
    onSelect: function(){
        // cc.log(this.getChildByName('diamond').name);
         // TODO 没闹明白为什么这里this.type不能用了
         //Game.instance.destroySProp(this);
         
         if(this.getChildByName('sdouble').active){
             Game.instance.destroySProp(this,0);
         }else if(this.getChildByName('sheal').active){
             Game.instance.destroySProp(this,1);
         }else if(this.getChildByName('smagnet').active){
            Game.instance.destroySProp(this,2);
         }else if(this.getChildByName('smineShield').active){
            Game.instance.destroySProp(this,3);
         }
         
     },
 
     onLoad: function () {
         this.type = 0;
         this.node.selected = false;
         this.double.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
         this.heal.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
         this.magnet.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
         this.shield.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
     },
 
     unuse: function () {
        this.double.off(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.heal.off(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.magnet.off(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.shield.off(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
     },
 
     reuse: function () {
        this.double.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.heal.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.magnet.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
        this.shield.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
     },
    start () {

    },

    // update (dt) {},
});
