var Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        betCounter: cc.ProgressBar,
        failBtnPanel: cc.Node,
        btnYes: cc.Node,
        btnNo: cc.Node,
        flagDark: cc.Node,
        flagLight: cc.Node,
        comboPanel: cc.Node,
        labelScore: {
            default: null,
            type: cc.Label
        },
        labelDiamond: {
            default: null,
            type: cc.Label
        },
        labelCombo: {
            default: null,
            type: cc.Label
        },
        failPanelLabelScore: cc.Label,
        failPanelLabelDiamond: cc.Label,
        failPanelLabelHighScore: cc.Label,
        failPanelLabelTotalDiamond: cc.Label,
        failPanelHighScore: cc.Sprite
    },

    // use this for initialization
    init: function (betDuration) {
        this.betDuration = betDuration;
        this.betTimer = 0;
        this.isBetCounting = false;
        this.failBtnPanel.active = false;
    },
    showFailPanel: function(score,diamond,highScore,diamondTotal,isHighScore){
        this.failBtnPanel.active = true;
        this.failPanelLabelScore.string = score;
        this.failPanelLabelDiamond.string = diamond;
        this.failPanelLabelHighScore.string = 'best ' + highScore;
        this.failPanelLabelTotalDiamond.string = 'total ' + diamondTotal;
        this.failPanelHighScore.node.active = isHighScore;
        this.btnYes.active = false;
        this.btnNo.active = false;
        this.flagDark.active = true;
        this.flagLight.active = false;
    }
});
