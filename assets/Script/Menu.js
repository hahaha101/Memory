var Types = require('Types');

cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node,
        assetMng: cc.Node,
        btnShop: cc.Button,
        mainPic: cc.Sprite,
        resizeDialog: cc.Prefab,
        diamondLabel: cc.Label,
        goldLabel: cc.Label,
        picTitle: cc.Label,
        picPrice: cc.Label,
        curIdx: 0
    },
    createMask: function(){
        var nMask = 0, nFlag = 0;
        let len = Types.picStatus.length;
        for(let i = 0;i < len;++i){
            nMask |= (Types.picStatus[i] << i);
        }
        return nMask;
    },
    arrayFromMask: function(nMask){
        for (var nShifted = nMask, aFromMask = []; nShifted; 
            aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
        return aFromMask;
    },

    initFromLocalStorage: function(){
        this.curIdx = 0;
        Types.picSet = cc.sys.localStorage.getItem('picSet');
        if(Types.picSet == null){
            Types.picSet = this.curIdx;
            cc.sys.localStorage.setItem('picSet',Types.picSet);
        }
        
        Types.diamondCount = cc.sys.localStorage.getItem('diamondCount');
        Types.diamondCount = 20000;
        if(Types.diamondCount == null){
            Types.diamondCount = 0;
            cc.sys.localStorage.setItem('diamondCount',Types.diamondCount);
        }

        Types.highScore0 = cc.sys.localStorage.getItem('highScore0');
        if(Types.highScore0 == null){
            Types.highScore0 = 0;
            cc.sys.localStorage.setItem('highScore0',Types.highScore0);
        }

        var picStatus = cc.sys.localStorage.getItem('picStatus');
        if(picStatus == null){
            Types.picStatus.push(1);
            for(let i = 1;i < this.assetMng.mainPics.length;++i){
                Types.picStatus.push(0);
            }
            var mask = this.createMask();
            cc.sys.localStorage.setItem('picStatus',mask);
        }else{
            Types.picStatus = this.arrayFromMask(picStatus);
        }
    },

    // use this for initialization
    onLoad: function () {
        this.audioMng = this.audioMng.getComponent('AudioMng');
        //this.audioMng.playMusic();
        this.assetMng = this.assetMng.getComponent('AssetMng');
        
        //cc.sys.localStorage.removeItem('diamondCount');
        this.initFromLocalStorage();
        this.refreshPicStatus();
        cc.director.preloadScene('game', function () {
            cc.log('Next scene preloaded');
        });
    },

    playGame: function (mode,customEventData) {
        cc.log(customEventData);
        cc.sys.localStorage.setItem('picSet',Types.picSet);
        cc.director.loadScene('game');
    },

    showPic: function(mode,customEventData){
        let len = this.assetMng.mainPics.length-1;
        
        //显示下一套图片
        if(customEventData == 1){
            if(this.curIdx < len){
                this.curIdx++;
            }
        }else{
            if(this.curIdx > 0){
                this.curIdx--;
            }
        }
        this.refreshPicStatus();
        Types.picSet = this.curIdx;
    },
    refreshPicStatus: function(){
        this.diamondLabel.string = Types.diamondCount;
        this.goldLabel.string = Types.highScore0;
        this.mainPic.spriteFrame = this.assetMng.mainPics[this.curIdx];
        this.picTitle.string = this.assetMng.picTitles[this.curIdx];
        this.picPrice.string = this.assetMng.picPrices[this.curIdx];
        if(Types.picStatus[this.curIdx] == 0){
            this.btnShop.node.active = false;
        }else{
            this.btnShop.node.active = true;
            let price = this.assetMng.picPrices[this.curIdx];
            if(price > Types.diamondCount){
                this.btnShop.interactable = false;
            }else{
                this.btnShop.interactable = true;
            }
        }
    },

    dialogBtn1: function(event, customEventData){
        var self = event.currentTarget;
        var dialog = self.parent.parent;
        dialog.getComponent("dialog").close();

        Types.diamondCount -= this.assetMng.picPrices[this.curIdx];
        cc.sys.localStorage.setItem('diamondCount',Types.diamondCount);
        this.diamondLabel.string = Types.diamondCount;

        Types.picStatus[Types.picSet] = 1;
        var mask = this.createMask();
        cc.sys.localStorage.setItem('picStatus',mask);
        //TODO-图片系列改为未锁定状态
    },

    dialogBtn2: function(event, customEventData){
        var self = event.currentTarget;
        var dialog = self.parent.parent;
        dialog.getComponent("dialog").close();
    },

    showConfirm: function(){
        var dialog = cc.instantiate(this.resizeDialog).getComponent("dialog").init("","确认解锁当前图片吗");
        var btn1Handler = CREATE_EVENT_HANDLER(this.node, "Menu", "dialogBtn1", "1");
        var btn2Handler = CREATE_EVENT_HANDLER(this.node, "Menu", "dialogBtn2", "2");
        dialog.addButton("确认", btn1Handler).addButton("取消", btn2Handler);
        cc.find("Canvas").addChild(dialog.node);
    },
    buyPic: function(){

        //1.查看购买状态
        let status = Types.picStatus[this.curIdx];
        if(status == 0){
            return;
        }

        //2.比较当前有的钻石数量和需要花费的钻石数量
        let price = this.assetMng.picPrices[this.curIdx];
        //3.钻石数量充足，确认是否购买
        if(price <= Types.diamondCount){
            this.showConfirm();
        }else{

        }
        
    },
    // called every frame
    update: function (dt) {

    },
});
