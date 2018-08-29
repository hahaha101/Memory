var Types = require('Types');
var Utils = require('Utils');
var ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        
        renderer: {
            default: null,
            type: cc.Node
        },
        lastCard:0,
        isSame:0
    },

    init: function () {
        this.ready = true;
        this.renderer = this.getComponent('ActorRenderer');
    },

    addCardOnce: function(type,card){
        //this.cards.push(card);
        if(card == this.lastCard){
            this.isSame = 0;
        }else{
            this.isSame = 1;
        }
        this.lastCard = card;
        this.renderer.onDealOnce(type,card, true);
    },

    addCard: function (type,card) {
        //this.cards.push(card);
        if(card == this.lastCard){
            this.isSame = 0;
        }else{
            this.isSame = 1;
        }
        this.lastCard = card;
        this.renderer.onDeal(type,card, true);
    },

    oldCardFly: function(){
        this.renderer.oldCardFly();
    },

    showFail: function(){
        this.renderer.showFail();
    },
    showNormal: function(){
        this.renderer.showNormal();
    },

    addHoleCard: function (card) {
        this.holeCard = card;
        this.renderer.onDeal(card, false);
    },

    stand: function () {
        this.state = ActorPlayingState.Stand;
    },

    revealHoldCard: function () {
        if (this.holeCard) {
            this.cards.unshift(this.holeCard);
            this.holeCard = null;
            this.renderer.onRevealHoldCard();
        }
    },

    // revealNormalCard: function() {
    //     this.onRevealNormalCard();
    // },

    report: function () {
        this.state = ActorPlayingState.Report;
    },

    reset: function () {
        this.cards = [];
        this.holeCard = null;
        this.reported = false;
        this.state = ActorPlayingState.Normal;
        this.renderer.onReset();
    }
});
