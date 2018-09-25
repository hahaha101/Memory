var Types = require('Types');
var PicConfigs = require('PicConfig')

cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node,
        assetMng: cc.Node,
        blockNode: cc.Node,
        btnShop: cc.Button,
        btnStart: cc.Button,
        mainPic: cc.Sprite,
        resizeDialog: cc.Prefab,
        diamondLabel: cc.Label,
        goldLabel: cc.Label,
        picTitle: cc.Label,
        picPrice: cc.Label,
        soundToggle: cc.Toggle,
        musicToggle: cc.Toggle,
        loadBg: cc.Node,
        loadProgress: cc.ProgressBar,
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
        var aFromMask = [];
        let loopCount = PicConfigs.picConfigs.length;
        for (var nShifted = nMask; loopCount > 0; nShifted >>>= 1){
            aFromMask.push(Boolean(nShifted & 1));
            --loopCount;
        }
        return aFromMask;
    },

    initFromLocalStorage: function(){
        Types.picSet = cc.sys.localStorage.getItem('picSet');
        if(Types.picSet == null){
            Types.isFirst = 1;
            Types.picSet = this.curIdx;
            cc.sys.localStorage.setItem('picSet',Types.picSet);
        }else{
            this.curIdx = Types.picSet;
        }
        
        Types.diamondCount = cc.sys.localStorage.getItem('diamondCount');
        if(Types.diamondCount == null){
            Types.diamondCount = 0;
            cc.sys.localStorage.setItem('diamondCount',Types.diamondCount);
        }

        Types.highScore0 = cc.sys.localStorage.getItem('highScore0');
        if(Types.highScore0 == null){
            Types.highScore0 = 0;
            cc.sys.localStorage.setItem('highScore0',Types.highScore0);
        }
        Types.soundOn = cc.sys.localStorage.getItem('soundOn');
        if(Types.soundOn == null){
            Types.soundOn = 1;
            cc.sys.localStorage.setItem('soundOn',Types.soundOn);
        }
        if(Types.soundOn == 0){
            this.soundToggle.isChecked = false;
        }else{
            this.soundToggle.isChecked = true;
        }
        Types.musicOn = cc.sys.localStorage.getItem('musicOn');
        if(Types.musicOn == null){
            Types.musicOn = 1;
            cc.sys.localStorage.setItem('musicOn',Types.musicOn);
        }
        if(Types.musicOn == 0){
            this.musicToggle.isChecked = false;
        }else{
            this.musicToggle.isChecked = true;
        }

        var picStatus = cc.sys.localStorage.getItem('picStatus');
        if(picStatus == null){
            Types.picStatus.push(1);
            for(let i = 1;i < PicConfigs.picConfigs.length;++i){
                Types.picStatus.push(0);
            }
            var mask = this.createMask();
            cc.sys.localStorage.setItem('picStatus',mask);
        }else{
            Types.picStatus = this.arrayFromMask(picStatus);
        }
    },

    loadAltasOver: function(err,atlas,self){
        if(err){
            cc.log(err);
            return;
        }else{
            PicConfigs.self.loadProgress.progress = PicConfigs.loadIdx / PicConfigs.picConfigs.length;
            for(let i = 1;i <= 10;++i){
                var tempStr = i + '';
                var frame = atlas.getSpriteFrame(tempStr);
                PicConfigs.picConfigs[PicConfigs.loadIdx].frames.push(frame);
            }
            if(PicConfigs.loadIdx < PicConfigs.picConfigs.length-1){
                PicConfigs.loadIdx++;
                var tempItem = PicConfigs.picConfigs[PicConfigs.loadIdx];
                cc.loader.loadRes(tempItem.name,cc.SpriteAtlas,PicConfigs.self.loadAltasOver);
            }else{
                PicConfigs.self.blockNode.active = false;
                PicConfigs.self.loadProgress.progress = 1;
                PicConfigs.self.loadBg.active = false;
                PicConfigs.self.refreshPicStatus();
            }
            return;
        }
        return;
    },
    // use this for initialization
    onLoad: function () {

        //this.loadBg.active = true;
        //this.blockNode.active = true;
        //PicConfigs.self = this;
        //var tempItem = PicConfigs.picConfigs[PicConfigs.loadIdx];
        //cc.loader.loadRes(tempItem.name,cc.SpriteAtlas,this.loadAltasOver);

        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.assetMng = this.assetMng.getComponent('AssetMng');

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.btnStart.interactable = true;
        this.curIdx = 0;
        this.initFromLocalStorage();
        this.audioMng.playMusic();

        for(let i = 0;i < 10;++i){
            if(i == 0){
                PicConfigs.picConfigs[i].frames = this.assetMng.fruit;
            }else if(i == 1){
                PicConfigs.picConfigs[i].frames = this.assetMng.animal1;
            }else if(i == 2){
                PicConfigs.picConfigs[i].frames = this.assetMng.animal2;
            }else if(i == 3){
                PicConfigs.picConfigs[i].frames = this.assetMng.cartoon;
            }else if(i == 4){
                PicConfigs.picConfigs[i].frames = this.assetMng.girl;
            }else if(i == 5){
                PicConfigs.picConfigs[i].frames = this.assetMng.girl3;
            }else if(i == 6){
                PicConfigs.picConfigs[i].frames = this.assetMng.girl5;
            }else if(i == 7){
                PicConfigs.picConfigs[i].frames = this.assetMng.girl6;
            }else if(i == 8){
                PicConfigs.picConfigs[i].frames = this.assetMng.girl7;
            }else if(i == 9){
                PicConfigs.picConfigs[i].frames = this.assetMng.girl8;
            }
            
        }
        this.refreshPicStatus();
        
        cc.director.preloadScene('game', function () {
            cc.log('Next scene preloaded');
        });
    },
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onKeyUp: function (event) {
        if(event.keyCode == cc.KEY.back){
            cc.director.end();
        }
    },
    onQuit: function(){
        if (typeof FBInstant === 'undefined'){
            cc.director.end();
        }else{
            FBInstant.quit();
        }
    },

    playGame: function (mode,customEventData) {
        this.audioMng.pauseMusic();
        this.audioMng.playButton();
        cc.sys.localStorage.setItem('picSet',Types.picSet);
        cc.director.loadScene('game');
    },

    showPic: function(mode,customEventData){
        this.audioMng.playButton();

        let len = PicConfigs.picConfigs.length-1;
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
        Types.picSet = this.curIdx;
        this.refreshPicStatus();
    },
    refreshPicStatus: function(){
        this.diamondLabel.string = Types.diamondCount;
        this.goldLabel.string = Types.highScore0;
        this.mainPic.spriteFrame = PicConfigs.picConfigs[this.curIdx].frames[0];
        this.picTitle.string = PicConfigs.picConfigs[this.curIdx].title;
        this.picPrice.string = PicConfigs.picConfigs[this.curIdx].price;
        if(Types.picStatus[this.curIdx] == 1){
            this.btnShop.node.active = false;
            this.btnStart.interactable = true;
        }else{
            this.btnShop.node.active = true;
            this.btnStart.interactable = false;
            let price = PicConfigs.picConfigs[this.curIdx].price;
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

        Types.diamondCount -= PicConfigs.picConfigs[this.curIdx].price;
        cc.sys.localStorage.setItem('diamondCount',Types.diamondCount);
        this.diamondLabel.string = Types.diamondCount;

        Types.picStatus[Types.picSet] = 1;
        var mask = this.createMask();
        cc.sys.localStorage.setItem('picStatus',mask);

        this.blockNode.active = false;
        //TODO-图片系列改为未锁定状态
        this.btnShop.node.active = false;
        this.btnStart.interactable = true;
    },

    dialogBtn2: function(event, customEventData){
        var self = event.currentTarget;
        var dialog = self.parent.parent;
        dialog.getComponent("dialog").close();
        this.blockNode.active = false;
    },

    showConfirm: function(){
        var dialog = cc.instantiate(this.resizeDialog).getComponent("dialog").init("","unlock the picture?",this.blockNode);
        var btn1Handler = CREATE_EVENT_HANDLER(this.node, "Menu", "dialogBtn1", "1");
        var btn2Handler = CREATE_EVENT_HANDLER(this.node, "Menu", "dialogBtn2", "2");
        dialog.addButton("yes", btn1Handler).addButton("no", btn2Handler);
        cc.find("Canvas").addChild(dialog.node);
        this.blockNode.active = true;
    },
    buyPic: function(){
        this.audioMng.playButton();
        //1.查看购买状态
        let status = Types.picStatus[this.curIdx];
        if(status == 1){
            return;
        }

        //2.比较当前有的钻石数量和需要花费的钻石数量
        let price = PicConfigs.picConfigs[this.curIdx].price;
        //3.钻石数量充足，确认是否购买
        if(price <= Types.diamondCount){
            this.showConfirm();
        }
        
    },
    onSoundCheck: function(event,customEventData){
        if(this.soundToggle.isChecked){
            Types.soundOn = 1;
        }else{
            Types.soundOn = 0;
        }
        cc.sys.localStorage.setItem('soundOn',Types.soundOn);
    },
    onMusicCheck: function(event,customEventData){
        if(this.musicToggle.isChecked){
            Types.musicOn = 1;
            this.audioMng.playMusic();
        }else{
            Types.musicOn = 0;
            this.audioMng.pauseMusic();
        }
        cc.sys.localStorage.setItem('musicOn',Types.musicOn);
    },
    // called every frame
    update: function (dt) {

    },
    onShareGame: function(){
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: this.getImgBase64(),
            text: 'Come and challenge my brain with me.',
            data: {myReplayData: '...'},
        }).then(() => {
            // continue with the game.
        });
    },
    // 截屏返回 iamge base6，用于 Share
    getImgBase64 () {

        let target = cc.find('Canvas');
        let width = 1334, height = 750;
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        }
        else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        return canvas.toDataURL('image/png');
    }
});
